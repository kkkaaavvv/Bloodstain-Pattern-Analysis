import cv2
import numpy as np
import os

def preprocess_image(image_path: str, debug: bool = False) -> tuple:
    
    # ── 1. Load image ──────────────────────────────────────────────────────────
    original = cv2.imread(image_path)
    if original is None:
        raise FileNotFoundError(f"Could not load image at: {image_path}")

    print(f"[INFO] Image loaded: {image_path}")
    print(f"[INFO] Shape: {original.shape}  |  dtype: {original.dtype}")

    # ── 2. Convert to grayscale ────────────────────────────────────────────────
    gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)

    # ── 3. Gaussian blur ───────────────────────────────────────────────────────
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # ── 4. Otsu's thresholding ─────────────────────────────────────────────────
    _, thresh = cv2.threshold(
        blurred, 0, 255,
        cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
    )

    # ── 5. Morphological cleanup ───────────────────────────────────────────────
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    opened = cv2.morphologyEx(thresh, cv2.MORPH_OPEN,  kernel, iterations=1)
    binary = cv2.morphologyEx(opened, cv2.MORPH_CLOSE, kernel, iterations=2)

    # ── 6. Debug output ────────────────────────────────────────────────────────
    if debug:
        os.makedirs("debug_output", exist_ok=True)
        cv2.imwrite("debug_output/1_gray.png",    gray)
        cv2.imwrite("debug_output/2_blurred.png", blurred)
        cv2.imwrite("debug_output/3_thresh.png",  thresh)
        cv2.imwrite("debug_output/4_binary.png",  binary)
        print("[DEBUG] Intermediate images saved to debug_output/")

    return original, gray, binary


# ── Quick test ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    # Usage: python preprocessing.py path/to/image.jpg
    # Or defaults to a test image
    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_image.jpg"

    original, gray, binary = preprocess_image(image_path, debug=True)

    # Show results
    cv2.imshow("Original",    original)
    cv2.imshow("Grayscale",   gray)
    cv2.imshow("Binary Mask", binary)

    print("\n[INFO] Press any key in an image window to close.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()


