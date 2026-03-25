import cv2
import numpy as np
import os

def draw_trajectories(original: np.ndarray,
                      angle_data: list,
                      line_length: int = 2000,
                      min_elongation: float = 1.3,
                      debug: bool = False) -> tuple:
    """
    Draws direction arrows and backward trajectory lines.
    Estimates Area of Convergence from line intersections.

    Args:
        original       : Original BGR image
        angle_data     : Enriched ellipse+angle data
        line_length    : How far to extend trajectory lines (pixels)
        min_elongation : Only use stains where major/minor >= this ratio
                         (circular stains have no reliable direction)
        debug          : Save output if True

    Returns:
        output_image   : Annotated image
        convergence_pt : Estimated (x, y) area of convergence
    """

    output_image = original.copy()
    h, w = original.shape[:2]

    trajectory_points = []   # collect line endpoints for convergence

    for e in angle_data:

        major      = e["major"]
        minor      = e["minor"]
        cx, cy     = e["center"]
        orient_deg = e["angle"]        # ellipse orientation (0–180°)
        impact_deg = e["impact_angle"]

        # ── Skip near-circular stains — no reliable direction ─────────────────
        if minor == 0:
            continue
        elongation = major / minor
        if elongation < min_elongation:
            continue

        # ── Convert orientation to radians ────────────────────────────────────
        orient_rad = np.radians(orient_deg)

        # ── Direction vector along major axis ─────────────────────────────────
        dx = np.cos(orient_rad)
        dy = np.sin(orient_rad)

        # ── Arrow endpoint (forward direction) ────────────────────────────────
        arrow_len = int(major * 1.2)
        ax = int(cx + dx * arrow_len)
        ay = int(cy + dy * arrow_len)

        # ── Backward trajectory endpoint ──────────────────────────────────────
        bx = int(cx - dx * line_length)
        by = int(cy - dy * line_length)

        # ── Clamp to image bounds ─────────────────────────────────────────────
        bx = np.clip(bx, 0, w - 1)
        by = np.clip(by, 0, h - 1)
        ax = np.clip(ax, 0, w - 1)
        ay = np.clip(ay, 0, h - 1)

        # ── Draw trajectory line (semi-transparent orange) ────────────────────
        cv2.line(output_image, (cx, cy), (bx, by), (0, 140, 255), 1,
                 cv2.LINE_AA)

        # ── Draw direction arrow (bright green) ───────────────────────────────
        cv2.arrowedLine(output_image, (cx, cy), (ax, ay),
                        (0, 255, 100), 2, cv2.LINE_AA, tipLength=0.3)

        # ── Store for convergence calculation ─────────────────────────────────
        trajectory_points.append(((cx, cy), (bx, by)))

    print(f"[INFO] Trajectories drawn : {len(trajectory_points)}")
    print(f"[INFO] Skipped (circular) : {len(angle_data) - len(trajectory_points)}")

    # ── Find Area of Convergence ──────────────────────────────────────────────
    convergence_pt = find_convergence(trajectory_points, w, h)

    if convergence_pt:
        px, py = convergence_pt
        print(f"[INFO] Estimated convergence point: ({px}, {py})")

        # Draw convergence marker
        cv2.circle(output_image, (px, py), 40, (0, 0, 255), 4)
        cv2.circle(output_image, (px, py), 8,  (0, 0, 255), -1)
        cv2.putText(
            output_image,
            "AREA OF ORIGIN",
            (px + 50, py),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.5, (0, 0, 255), 3
        )

    if debug:
        os.makedirs("debug_output", exist_ok=True)
        cv2.imwrite("debug_output/8_trajectories.png", output_image)
        print("[DEBUG] Trajectory image saved to debug_output/8_trajectories.png")

    return output_image, convergence_pt


def find_convergence(trajectory_points: list, w: int, h: int):
    """
    Estimates convergence point by averaging all backward
    trajectory line endpoints (simple geometric mean).

    For a more accurate result we'd compute pairwise
    line-line intersections — this is the fast approximation.
    """

    if not trajectory_points:
        return None

    end_xs = [p[1][0] for p in trajectory_points]
    end_ys = [p[1][1] for p in trajectory_points]

    # Remove outliers using IQR
    def iqr_filter(vals):
        q1, q3 = np.percentile(vals, 25), np.percentile(vals, 75)
        iqr = q3 - q1
        return [v for v in vals if q1 - 1.5*iqr <= v <= q3 + 1.5*iqr]

    filtered_x = iqr_filter(end_xs)
    filtered_y = iqr_filter(end_ys)

    if not filtered_x or not filtered_y:
        return None

    cx = int(np.mean(filtered_x))
    cy = int(np.mean(filtered_y))

    # Clamp to image
    cx = np.clip(cx, 0, w - 1)
    cy = np.clip(cy, 0, h - 1)

    return (cx, cy)


# ── Quick test ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from preprocessing import preprocess_image
    from segmentation  import detect_stains
    from ellipse       import fit_ellipses
    from angle         import calculate_angles

    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_image.jpg"

    # Full pipeline
    original, gray, binary = preprocess_image(image_path, debug=False)
    contours, _            = detect_stains(original, binary,
                                           min_area=1000, debug=False)
    ellipse_data, _        = fit_ellipses(original, contours, debug=False)
    angle_data, _          = calculate_angles(original, ellipse_data,
                                              debug=False)

    # Draw trajectories
    output, convergence = draw_trajectories(
                        original, angle_data,
                        line_length=3000,
                        min_elongation=1.1,   # ← NEW (includes more stains)
                        debug=True)

    # ── Display ───────────────────────────────────────────────────────────────
    screen_size = 750
    h2, w2 = output.shape[:2]
    scale  = screen_size / max(h2, w2)
    display = cv2.resize(output, (int(w2*scale), int(h2*scale)),
                         interpolation=cv2.INTER_AREA)

    # Legend
    items = [
        ("Green arrow  = travel direction",  (0, 255, 100)),
        ("Orange line  = backward trajectory", (0, 140, 255)),
        ("Red circle   = Area of Origin",    (0, 0, 255)),
    ]
    for idx, (text, color) in enumerate(items):
        y = 25 + idx * 24
        cv2.line(display, (10, y), (25, y), color, 3)
        cv2.putText(display, text, (32, y + 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (50, 50, 50), 1)

    cv2.namedWindow("Trajectories", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Trajectories", 50, 50)
    cv2.imshow("Trajectories", display)

    if convergence:
        print(f"\n[RESULT] Area of Origin estimated at: {convergence}")
    print("[INFO] Press any key to close.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()