import cv2
import numpy as np
import os
import sys
import csv
from datetime import datetime

from preprocessing import preprocess_image
from segmentation  import detect_stains
from ellipse       import fit_ellipses
from angle         import calculate_angles
from trajectory    import draw_trajectories

# ── CONFIG ────────────────────────────────────────────────────────────────────
MIN_AREA      = 1000     # minimum stain area (px²)
MIN_ELONGATION = 1.1     # minimum major/minor ratio for trajectory
LINE_LENGTH   = 3000     # trajectory line length (px)
SCREEN_SIZE   = 750      # display window size (px)

def run_pipeline(image_path: str, output_dir: str = "results") -> dict:
    """
    Runs the full bloodstain analysis pipeline on one image.
    Returns a summary dict with all findings.
    """

    os.makedirs(output_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(image_path))[0]

    print(f"\n{'='*60}")
    print(f"  BLOODSTAIN PATTERN ANALYSIS")
    print(f"  Image : {image_path}")
    print(f"  Time  : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")

    # ── PHASE 1: Preprocessing ────────────────────────────────────────────────
    print("── PHASE 1: Preprocessing ──────────────────────────────")
    original, gray, binary = preprocess_image(image_path, debug=True)

    # ── PHASE 1: Segmentation ─────────────────────────────────────────────────
    print("\n── PHASE 1: Segmentation ───────────────────────────────")
    contours, contour_img = detect_stains(original, binary,
                                          min_area=MIN_AREA, debug=True)

    # ── PHASE 2: Ellipse Fitting ──────────────────────────────────────────────
    print("\n── PHASE 2: Ellipse Fitting ─────────────────────────────")
    ellipse_data, ellipse_img = fit_ellipses(original, contours, debug=True)

    # ── PHASE 2: Angle Calculation ────────────────────────────────────────────
    print("\n── PHASE 2: Angle Calculation ───────────────────────────")
    angle_data, angle_img = calculate_angles(original, ellipse_data,
                                             debug=True)

    # ── PHASE 3: Trajectory & Convergence ────────────────────────────────────
    print("\n── PHASE 3: Trajectory & Convergence ───────────────────")
    traj_img, convergence = draw_trajectories(
        original, angle_data,
        line_length=LINE_LENGTH,
        min_elongation=MIN_ELONGATION,
        debug=True
    )

    # ── Build final annotated image ───────────────────────────────────────────
    final_img = build_final_image(traj_img, angle_data, convergence)

    # ── Save outputs ──────────────────────────────────────────────────────────
    out_img_path = os.path.join(output_dir, f"{base_name}_analyzed.jpg")
    out_csv_path = os.path.join(output_dir, f"{base_name}_report.csv")
    out_txt_path = os.path.join(output_dir, f"{base_name}_summary.txt")

    cv2.imwrite(out_img_path, final_img)
    save_csv(angle_data, out_csv_path)

    angles      = [d["impact_angle"] for d in angle_data]
    summary     = {
        "image"          : image_path,
        "total_stains"   : len(angle_data),
        "mean_angle"     : round(float(np.mean(angles)), 1) if angles else 0,
        "min_angle"      : round(float(np.min(angles)), 1)  if angles else 0,
        "max_angle"      : round(float(np.max(angles)), 1)  if angles else 0,
        "circular"       : sum(1 for a in angles if a >= 70),
        "elliptical"     : sum(1 for a in angles if 45 <= a < 70),
        "elongated"      : sum(1 for a in angles if 20 <= a < 45),
        "very_shallow"   : sum(1 for a in angles if a < 20),
        "convergence_pt" : convergence,
        "output_image"   : out_img_path,
    }

    save_text_report(summary, angle_data, out_txt_path)

    # ── Print final summary ───────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  ANALYSIS COMPLETE")
    print(f"{'='*60}")
    print(f"  Total stains detected  : {summary['total_stains']}")
    print(f"  Mean impact angle      : {summary['mean_angle']}°")
    print(f"  Min  impact angle      : {summary['min_angle']}°")
    print(f"  Max  impact angle      : {summary['max_angle']}°")
    print(f"  Circular   stains (≥70): {summary['circular']}")
    print(f"  Elliptical stains (45-70): {summary['elliptical']}")
    print(f"  Elongated  stains (20-45): {summary['elongated']}")
    print(f"  Very shallow  (<20)    : {summary['very_shallow']}")
    if convergence:
        print(f"  Estimated Area of Origin: {convergence}")
    print(f"\n  Saved → {out_img_path}")
    print(f"  Saved → {out_csv_path}")
    print(f"  Saved → {out_txt_path}")
    print(f"{'='*60}\n")

    return summary, final_img


def build_final_image(traj_img, angle_data, convergence):
    """Adds a clean info panel to the trajectory image."""

    output = traj_img.copy()
    h, w   = output.shape[:2]

    # ── Semi-transparent info panel (top-left) ────────────────────────────────
    overlay = output.copy()
    cv2.rectangle(overlay, (10, 10), (520, 160), (0, 0, 0), -1)
    cv2.addWeighted(overlay, 0.5, output, 0.5, 0, output)

    angles = [d["impact_angle"] for d in angle_data]

    lines = [
        f"BLOODSTAIN PATTERN ANALYSIS",
        f"Stains detected  : {len(angle_data)}",
        f"Mean impact angle: {np.mean(angles):.1f} deg",
        f"Circular (>=70)  : {sum(1 for a in angles if a >= 70)}  "
        f"| Elliptical: {sum(1 for a in angles if 45 <= a < 70)}",
        f"Elongated (20-45): {sum(1 for a in angles if 20 <= a < 45)}  "
        f"| Shallow  : {sum(1 for a in angles if a < 20)}",
        f"Area of Origin   : {convergence if convergence else 'N/A'}",
    ]

    for i, line in enumerate(lines):
        color = (0, 255, 255) if i == 0 else (255, 255, 255)
        scale = 0.65 if i == 0 else 0.5
        cv2.putText(output, line, (20, 40 + i * 22),
                    cv2.FONT_HERSHEY_SIMPLEX, scale, color, 1)

    # ── Color legend (bottom-left) ─────────────────────────────────────────────
    legend_items = [
        ((0, 255, 0),    "Green  = travel direction arrow"),
        ((0, 140, 255),  "Orange = backward trajectory"),
        ((0, 0, 255),    "Red    = estimated Area of Origin"),
    ]
    for idx, (color, text) in enumerate(legend_items):
        y = h - 80 + idx * 22
        cv2.circle(output, (25, y), 7, color, -1)
        cv2.putText(output, text, (40, y + 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

    return output


def save_csv(angle_data: list, path: str):
    """Saves per-stain data to CSV."""
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ID", "Center_X", "Center_Y",
            "Major_px", "Minor_px",
            "Orientation_deg", "Impact_angle_deg", "Stain_type"
        ])
        for d in angle_data:
            writer.writerow([
                d["id"],
                d["center"][0], d["center"][1],
                d["major"], d["minor"],
                d["angle"], d["impact_angle"],
                d["stain_type"]
            ])
    print(f"[INFO] CSV saved: {path}")


def save_text_report(summary: dict, angle_data: list, path: str):
    """Saves a human-readable text report."""
    with open(path, "w", encoding="utf-8") as f:
        f.write("=" * 55 + "\n")
        f.write("   BLOODSTAIN PATTERN ANALYSIS REPORT\n")
        f.write(f"   Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 55 + "\n\n")
        f.write(f"Image           : {summary['image']}\n")
        f.write(f"Total stains    : {summary['total_stains']}\n")
        f.write(f"Mean angle      : {summary['mean_angle']}°\n")
        f.write(f"Min angle       : {summary['min_angle']}°\n")
        f.write(f"Max angle       : {summary['max_angle']}°\n")
        f.write(f"Area of Origin  : {summary['convergence_pt']}\n\n")
        f.write(f"Stain Breakdown:\n")
        f.write(f"  Circular   (≥70°) : {summary['circular']}\n")
        f.write(f"  Elliptical (45-70): {summary['elliptical']}\n")
        f.write(f"  Elongated  (20-45): {summary['elongated']}\n")
        f.write(f"  Very shallow (<20): {summary['very_shallow']}\n\n")
        f.write("-" * 55 + "\n")
        f.write(f"{'ID':>4}  {'Center':>16}  {'Impact θ':>9}  Type\n")
        f.write("-" * 55 + "\n")
        for d in angle_data:
            f.write(f"#{d['id']:>3}  {str(d['center']):>16}  "
                    f"{d['impact_angle']:>8.1f}°  {d['stain_type']}\n")
    print(f"[INFO] Report saved: {path}")


# ── Dataset batch mode ─────────────────────────────────────────────────────────
def run_batch(image_dir: str, output_dir: str = "results"):
    """Processes all images in a folder."""

    supported = (".jpg", ".jpeg", ".png", ".bmp", ".tiff")
    images    = [f for f in os.listdir(image_dir)
                 if f.lower().endswith(supported)]

    if not images:
        print(f"[ERROR] No images found in: {image_dir}")
        return

    print(f"[INFO] Found {len(images)} images in {image_dir}")
    print(f"[INFO] Results will be saved to: {output_dir}\n")

    all_summaries = []

    for i, fname in enumerate(sorted(images), 1):
        path = os.path.join(image_dir, fname)
        print(f"\n[{i}/{len(images)}] Processing: {fname}")
        try:
            summary, _ = run_pipeline(path, output_dir)
            all_summaries.append(summary)
        except Exception as e:
            print(f"[ERROR] Failed on {fname}: {e}")
            continue

    # ── Save master CSV with all images ───────────────────────────────────────
    master_csv = os.path.join(output_dir, "ALL_results.csv")
    with open(master_csv, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "image", "total_stains", "mean_angle",
            "min_angle", "max_angle",
            "circular", "elliptical", "elongated",
            "very_shallow", "convergence_pt"
        ])
        writer.writeheader()
        for s in all_summaries:
            row = {k: v for k, v in s.items() if k != "output_image"}
            writer.writerow(row)

    print(f"\n[DONE] Batch complete. Master CSV: {master_csv}")


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single image : python main.py images/test.jpg")
        print("  Full dataset : python main.py images/  --batch")
        sys.exit(1)

    path  = sys.argv[1]
    batch = "--batch" in sys.argv

    if batch or os.path.isdir(path):
        # ── BATCH MODE: entire dataset folder ─────────────────────────────────
        run_batch(path, output_dir="results")

    else:
        # ── SINGLE IMAGE MODE ─────────────────────────────────────────────────
        summary, final_img = run_pipeline(path, output_dir="results")

        # Display
        h, w   = final_img.shape[:2]
        scale  = SCREEN_SIZE / max(h, w)
        display = cv2.resize(final_img,
                             (int(w * scale), int(h * scale)),
                             interpolation=cv2.INTER_AREA)

        cv2.namedWindow("Bloodstain Analysis", cv2.WINDOW_NORMAL)
        cv2.moveWindow("Bloodstain Analysis", 50, 50)
        cv2.imshow("Bloodstain Analysis", display)
        print("[INFO] Press any key to close.")
        cv2.waitKey(0)
        cv2.destroyAllWindows()