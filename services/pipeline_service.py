import time
import os
import uuid

from main import run_pipeline
from utils.helpers import convert_numpy


# 🔹 CV wrapper (used by API)
def run_cv(image_path, output_folder):
    summary, _ = run_pipeline(image_path, output_dir=output_folder)

    summary = convert_numpy(summary)

    return {
        "image": os.path.basename(summary["output_image"]),
        "stains": summary.get("total_stains",0 ),
        "summary": summary
    }


# 🔹 Main processing function (used in API route)
def process_image(file, upload_folder, output_folder, debug=False):

    # Generate unique filename
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    start_time = time.time()

    # Run pipeline
    summary, _ = run_pipeline(filepath, output_dir=output_folder)

    # Convert numpy → python
    summary = convert_numpy(summary)

    end_time = time.time()

    # Debug images (optional)
    debug_images = None
    if debug:
        debug_images = {
            "gray": "debug_output/1_gray.png",
            "binary": "debug_output/4_binary.png",
            "contours": "debug_output/5_contours.png",
            "ellipses": "debug_output/6_ellipses.png",
            "reconstruction": "debug_output/final_output.png"
        }

    # Final response
    return {
        "method": "cv",
        "image": os.path.basename(summary["output_image"]),
        "stains": summary.get("total_stains", 0),
        "processing_time": round(end_time - start_time, 2),
        "debug_images": debug_images
    }