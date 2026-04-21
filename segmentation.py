import cv2
import numpy as np
import os

def detect_stains(original: np.ndarray, binary: np.ndarray,
                  min_area: int = 100, debug: bool = False) -> tuple:

    # ── 1. Find all contours ────
    contours, _ = cv2.findContours(
        binary,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )
    print(f"[INFO] Total raw contours found: {len(contours)}")

    # ── 2. Filter small contours ─────────────
    # Anything below min_area pixels is likely noise, not a real stain
    contours_filtered = [c for c in contours if cv2.contourArea(c) >= min_area]
    print(f"[INFO] Contours after filtering (min_area={min_area}): {len(contours_filtered)}")

    # ── 3. Draw contours on a copy of the original ────────────────
    output_image = original.copy()

    for i, contour in enumerate(contours_filtered):
        area = cv2.contourArea(contour)

        # Draw contour boundary in green
        cv2.drawContours(output_image, [contour], -1, (0, 255, 0), 2)

        # Label each stain with its index and area
        M = cv2.moments(contour)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
            cv2.putText(
                output_image,
                f"#{i+1}",
                (cx - 10, cy),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.4, (0, 255, 255), 1
            )

        print(f"  Stain #{i+1}: area = {area:.1f} px²")

    # ── 4. Debug output ────────────────────────────────────────────────────────
    if debug:
        os.makedirs("debug_output", exist_ok=True)
        cv2.imwrite("debug_output/5_contours.png", output_image)
        print("[DEBUG] Contour image saved to debug_output/5_contours.png")

    return contours_filtered, output_image


# ── Quick test ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    from preprocessing import preprocess_image

    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_image.jpg"

    # Run preprocessing first
    original, gray, binary = preprocess_image(image_path, debug=False)

    # Detect stains
    contours, output = detect_stains(original, binary, min_area=3000, debug=True)

    # Show result
    # ── Resized display window ─────────────────
    screen_size = 750  # reduce to 650 if still too wide

    h, w = output.shape[:2]
    scale = screen_size / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)

    display = cv2.resize(output, (new_w, new_h), interpolation=cv2.INTER_AREA)

    cv2.namedWindow("Detected Stains", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Detected Stains", 50, 50)   # positions window top-left
    cv2.imshow("Detected Stains", display)

    print(f"\n[RESULT] {len(contours)} stains detected.")
    print("[INFO] Press any key to close.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()