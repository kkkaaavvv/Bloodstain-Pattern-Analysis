import cv2
import numpy as np
import os

def calculate_angles(original: np.ndarray,
                     ellipse_data: list,
                     debug: bool = False) -> tuple:
    """
    Calculates angle of impact for each stain using:
        theta = arcsin(minor / major)

    Args:
        original     : Original BGR image
        ellipse_data : List of ellipse dicts from fit_ellipses()
        debug        : Save output image if True

    Returns:
        angle_data   : ellipse_data enriched with impact angle
        output_image : Annotated image
    """

    output_image = original.copy()
    angle_data   = []

    print(f"\n{'ID':>4}  {'Center':>16}  {'Major':>7}  "
          f"{'Minor':>7}  {'Angle(°)':>9}  {'Impact θ':>9}  {'Type'}")
    print("-" * 75)

    for e in ellipse_data:

        major = e["major"]
        minor = e["minor"]

        # ── Guard: ratio must be <= 1.0 for arcsin ────────────────────────────
        ratio = minor / major
        ratio = min(ratio, 1.0)   # clamp floating point errors

        # ── Impact angle in degrees ───────────────────────────────────────────
        theta_rad = np.arcsin(ratio)
        theta_deg = round(np.degrees(theta_rad), 1)

        # ── Classify stain type by angle ──────────────────────────────────────
        if theta_deg >= 70:
            stain_type = "CIRCULAR (vertical)"
        elif theta_deg >= 45:
            stain_type = "ELLIPTICAL (medium)"
        elif theta_deg >= 20:
            stain_type = "ELONGATED (shallow)"
        else:
            stain_type = "VERY SHALLOW (glancing)"

        # ── Store enriched data ───────────────────────────────────────────────
        enriched = {**e, "impact_angle": theta_deg, "stain_type": stain_type}
        angle_data.append(enriched)

        # ── Draw ellipse ──────────────────────────────────────────────────────
        cv2.ellipse(output_image, e["ellipse_raw"], (255, 255, 0), 2)

        # ── Color-code center dot by angle ────────────────────────────────────
        # Green = steep/vertical | Yellow = medium | Red = shallow
        if theta_deg >= 70:
            dot_color = (0, 255, 0)      # green
        elif theta_deg >= 45:
            dot_color = (0, 255, 255)    # yellow
        elif theta_deg >= 20:
            dot_color = (0, 165, 255)    # orange
        else:
            dot_color = (0, 0, 255)      # red

        cx, cy = e["center"]
        cv2.circle(output_image, (cx, cy), 6, dot_color, -1)

        # ── Label: stain ID + impact angle ───────────────────────────────────
        cv2.putText(
            output_image,
            f"#{e['id']} {theta_deg}",
            (cx + 8, cy - 8),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45, (255, 255, 255), 1
        )

        print(f"#{e['id']:>3}  {str(e['center']):>16}  {major:>7.1f}  "
              f"{minor:>7.1f}  {e['angle']:>9.1f}  {theta_deg:>8.1f}°"
              f"  {stain_type}")

    # ── Summary statistics ────────────────────────────────────────────────────
    angles = [d["impact_angle"] for d in angle_data]
    print(f"\n── Impact Angle Summary ──────────────────────────────")
    print(f"  Total stains     : {len(angle_data)}")
    print(f"  Mean angle       : {np.mean(angles):.1f}°")
    print(f"  Min angle        : {np.min(angles):.1f}°  ← most elongated")
    print(f"  Max angle        : {np.max(angles):.1f}°  ← most circular")
    print(f"  Circular  (≥70°) : {sum(1 for a in angles if a >= 70)}")
    print(f"  Elliptical(45-70): {sum(1 for a in angles if 45 <= a < 70)}")
    print(f"  Elongated (20-45): {sum(1 for a in angles if 20 <= a < 45)}")
    print(f"  Very shallow(<20): {sum(1 for a in angles if a < 20)}")

    if debug:
        os.makedirs("debug_output", exist_ok=True)
        cv2.imwrite("debug_output/7_angles.png", output_image)
        print("\n[DEBUG] Angle image saved to debug_output/7_angles.png")

    return angle_data, output_image


# ── Quick test ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from preprocessing import preprocess_image
    from segmentation  import detect_stains
    from ellipse       import fit_ellipses

    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_image.jpg"

    original, gray, binary = preprocess_image(image_path, debug=False)
    contours, _            = detect_stains(original, binary,
                                           min_area=1000, debug=False)
    ellipse_data, _        = fit_ellipses(original, contours, debug=False)

    angle_data, output     = calculate_angles(original, ellipse_data,
                                              debug=True)

    # ── Display ───────────────────────────────────────────────────────────────
    screen_size = 750
    h, w = output.shape[:2]
    scale = screen_size / max(h, w)
    display = cv2.resize(output, (int(w*scale), int(h*scale)),
                         interpolation=cv2.INTER_AREA)

    # ── Legend ────────────────────────────────────────────────────────────────
    legend = [
        ("GREEN  dot = Circular   >=70 deg", (0, 255, 0)),
        ("YELLOW dot = Elliptical 45-70 deg", (0, 255, 255)),
        ("ORANGE dot = Elongated  20-45 deg", (0, 165, 255)),
        ("RED    dot = Very shallow <20 deg", (0, 0, 255)),
    ]
    for idx, (text, color) in enumerate(legend):
        cv2.circle(display, (18, 20 + idx * 22), 7, color, -1)
        cv2.putText(display, text, (30, 25 + idx * 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255,255,255), 1)

    cv2.namedWindow("Impact Angles", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Impact Angles", 50, 50)
    cv2.imshow("Impact Angles", display)
    print("\n[INFO] Press any key to close.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()