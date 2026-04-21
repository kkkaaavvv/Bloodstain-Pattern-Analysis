from ultralytics import YOLO
import os

# Load model once (VERY IMPORTANT)
model = YOLO("runs/detect/train-2/weights/best.pt")

def run_yolo(image_path, output_folder="results"):
    results = model(image_path)

    # Save output image
    output_path = os.path.join(output_folder, "yolo_output.jpg")
    results[0].save(filename=output_path)

    detections = []

    for box in results[0].boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0])

        detections.append({
            "bbox": [x1, y1, x2, y2],
            "confidence": round(conf, 3)
        })

    return {
        "num_detections": len(detections),
        "detections": detections,
        "output_image": output_path
    }