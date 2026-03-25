import cv2
import numpy as np
import os

def fit_ellipses(original: np.ndarray, contours: list,
                 debug: bool = False) -> tuple:
    """
    Fits ellipses to valid contours and draws them on the image.

    Args:
        original : Original BGR image
        contours : Filtered contours from segmentation
        debug    : If True, saves output image

    Returns:
        ellipse_data  : List of dicts with ellipse parameters per stain
        output_image  : Image with ellipses drawn
    """

    output_image = original.copy()
    ellipse_data = []

    skipped = 0

    for i, contour in enumerate(contours):

        # ── Requirement: need at least 5 points to fit ellipse ────────────────
        if len(contour) < 5:
            skipped += 1
            continue

        # ── Fit ellipse ───────────────────────────────────────────────────────
        # Returns: ( (center_x, center_y), (minor_axis, major_axis), angle )
        ellipse = cv2.fitEllipse(contour)

        (cx, cy), (minor, major), angle = ellipse

        # ── Skip degenerate ellipses (flat or zero-size) ──────────────────────
        if major < 1 or minor < 1:
            skipped += 1
            continue

        # ── Store ellipse data ────────────────────────────────────────────────
        ellipse_data.append({
            "id"         : i + 1,
            "center"     : (int(cx), int(cy)),
            "major"      : round(major, 2),   # length (longer axis)
            "minor"      : round(minor, 2),   # width  (shorter axis)
            "angle"      : round(angle, 2),   # orientation in degrees
            "ellipse_raw": ellipse            # keep raw for drawing
        })

        # ── Draw ellipse in cyan ──────────────────────────────────────────────
        cv2.ellipse(output_image, ellipse, (255, 255, 0), 2)

        # ── Draw center dot ───────────────────────────────────────────────────
        cv2.circle(output_image, (int(cx), int(cy)), 5, (0, 255, 255), -1)

        # ── Label stain ID ────────────────────────────────────────────────────
        cv2.putText(
            output_image,
            f"#{i+1}",
            (int(cx) + 6, int(cy) - 6),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5, (255, 255, 255), 1
        )

    print(f"[INFO] Ellipses fitted : {len(ellipse_data)}")
    print(f"[INFO] Skipped         : {skipped} (< 5 points or degenerate)")

    # ── Print ellipse data table ──────────────────────────────────────────────
    print(f"\n{'ID':>4} {'Center':>18} {'Major':>8} {'Minor':>8} {'Angle':>8}")
    print("-" * 52)
    for e in ellipse_data:
        print(f"#{e['id']:>3}  {str(e['center']):>18}  "
              f"{e['major']:>8.1f}  {e['minor']:>8.1f}  {e['angle']:>8.1f}°")

    if debug:
        os.makedirs("debug_output", exist_ok=True)
        cv2.imwrite("debug_output/6_ellipses.png", output_image)
        print("\n[DEBUG] Ellipse image saved to debug_output/6_ellipses.png")

    return ellipse_data, output_image


# ── Quick test ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from preprocessing import preprocess_image
    from segmentation  import detect_stains

    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_image.jpg"

    # Run pipeline so far
    original, gray, binary = preprocess_image(image_path, debug=False)
    contours, _ = detect_stains(original, binary, min_area=1000, debug=False)

    # Fit ellipses
    ellipse_data, output = fit_ellipses(original, contours, debug=True)

    # Display
    screen_size = 750
    h, w = output.shape[:2]
    scale = screen_size / max(h, w)
    display = cv2.resize(output, (int(w*scale), int(h*scale)),
                         interpolation=cv2.INTER_AREA)

    cv2.namedWindow("Ellipse Fitting", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Ellipse Fitting", 50, 50)
    cv2.imshow("Ellipse Fitting", display)
    print("\n[INFO] Press any key to close.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()