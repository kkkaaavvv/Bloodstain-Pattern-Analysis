import cv2
import numpy as np
import os
import math


# ── Line intersection helper ─────────────────────────────────────────
def line_intersection(p1, p2, p3, p4):
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3
    x4, y4 = p4

    denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)
    if denom == 0:
        return None

    px = ((x1*y2 - y1*x2)*(x3-x4) - (x1-x2)*(x3*y4 - y3*x4)) / denom
    py = ((x1*y2 - y1*x2)*(y3-y4) - (y1-y2)*(x3*y4 - y3*x4)) / denom

    return int(px), int(py)


# ── Main function ────────────────────────────────────────────────────
def fit_ellipses(original: np.ndarray, contours: list,
                 debug: bool = False) -> tuple:

    output_image = original.copy()
    ellipse_data = []

    skipped = 0
    lines = []

    for i, contour in enumerate(contours):

        if len(contour) < 5:
            skipped += 1
            continue

        ellipse = cv2.fitEllipse(contour)
        (cx, cy), (minor, major), angle = ellipse

        # Skip invalid
        if major < 1 or minor < 1:
            skipped += 1
            continue

        # Ensure major > minor
        if minor > major:
            minor, major = major, minor
            angle += 90

        #  Skip circular stains (no direction)
        if minor / major > 0.9:
            continue

        #  Angle of Impact
        ratio = min(1.0, minor / major)
        impact_angle = math.degrees(math.asin(ratio))

        #  Direction (BACKWARD)
        dx = math.cos(math.radians(angle))
        dy = math.sin(math.radians(angle))

        dx = -dx
        dy = -dy

        #  Trajectory
        length = 200
        x1, y1 = int(cx), int(cy)
        x2 = int(cx + length * dx)
        y2 = int(cy + length * dy)

        lines.append(((x1, y1), (x2, y2)))

        # Draw line
        cv2.line(output_image, (x1, y1), (x2, y2), (0, 0, 255), 2)

        # Store data
        ellipse_data.append({
            "id": i + 1,
            "center": (x1, y1),
            "major": round(major, 2),
            "minor": round(minor, 2),
            "angle": round(angle, 2),
            "angle_of_impact": round(impact_angle, 2),
            "direction": (round(dx, 3), round(dy, 3)),
            "ellipse_raw": ellipse
        })

        # Draw ellipse
        cv2.ellipse(output_image, ellipse, (255, 255, 0), 2)

        # Draw center
        cv2.circle(output_image, (x1, y1), 5, (0, 255, 255), -1)

        # Label
        cv2.putText(
            output_image,
            f"#{i+1}",
            (x1 + 6, y1 - 6),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.5, (255, 255, 255), 1
        )

    # ── Compute intersections ──────────────────────────────────────
    intersection_points = []

    for i in range(len(lines)):
        for j in range(i + 1, len(lines)):
            p = line_intersection(
                lines[i][0], lines[i][1],
                lines[j][0], lines[j][1]
            )
            if p is not None:
                intersection_points.append(p)

    #  Compute origin
    if len(intersection_points) > 0:
        avg_x = int(sum(p[0] for p in intersection_points) / len(intersection_points))
        avg_y = int(sum(p[1] for p in intersection_points) / len(intersection_points))

        cv2.circle(output_image, (avg_x, avg_y), 8, (0, 0, 255), -1)
        cv2.putText(output_image, "Origin",
                    (avg_x + 5, avg_y - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5, (0, 0, 255), 2)

    # ── Logs ─────────────────────────────────────────────────────────
    print(f"[INFO] Ellipses fitted : {len(ellipse_data)}")
    print(f"[INFO] Skipped         : {skipped}")

    print(f"\n{'ID':>4} {'Center':>18} {'Major':>8} {'Minor':>8} {'Angle':>8} {'Impact':>8}")
    print("-" * 70)

    for e in ellipse_data:
        print(f"#{e['id']:>3}  {str(e['center']):>18}  "
              f"{e['major']:>8.1f}  {e['minor']:>8.1f}  "
              f"{e['angle']:>8.1f}°  {e['angle_of_impact']:>8.1f}°")

    # Debug save
    if debug:
        os.makedirs("debug_output", exist_ok=True)
        cv2.imwrite("debug_output/final_reconstruction.png", output_image)
        print("\n[DEBUG] Final reconstruction saved")

    return ellipse_data, output_image


# ── Test ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from preprocessing import preprocess_image
    from segmentation import detect_stains

    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_image.jpg"

    original, gray, binary = preprocess_image(image_path, debug=False)

    # Important: low min_area for small stains
    contours, _ = detect_stains(original, binary, min_area=100, debug=False)

    ellipse_data, output = fit_ellipses(original, contours, debug=True)

    # Display
    h, w = output.shape[:2]
    scale = 700 / max(h, w)
    display = cv2.resize(output, (int(w*scale), int(h*scale)))

    cv2.namedWindow("Reconstruction Output", cv2.WINDOW_NORMAL)
    cv2.imshow("Reconstruction Output", display)
    cv2.waitKey(0)
    cv2.destroyAllWindows()