import os
import glob
from main import run_pipeline
from utils.helpers import convert_numpy


def run_cv(image_path, output_folder):
    DEBUG_FOLDER = "debug_output"

    # 🔥 0. CLEAR OLD RESULTS
    for f in os.listdir(output_folder):
        try:
            os.remove(os.path.join(output_folder, f))
        except Exception as e:
            print(f"⚠️ Could not delete {f}: {e}")

    # 🔥 0.1 CLEAR OLD DEBUG OUTPUT
    for f in os.listdir(DEBUG_FOLDER):
        try:
            os.remove(os.path.join(DEBUG_FOLDER, f))
        except Exception as e:
            print(f"⚠️ Could not delete debug file {f}: {e}")

    # 🔽 Run full CV pipeline
    summary, _ = run_pipeline(image_path, output_dir=output_folder)
    summary = convert_numpy(summary)

    steps = {}

    # ✅ 1. Add reconstruction image from summary if available
    if "output_image" in summary:
        path = summary["output_image"]

        if path and os.path.exists(path):
            steps["reconstruction"] = path

    # ✅ 2. Scan debug_output for pipeline step images
    file_map = {
        "gray": "grayscale",
        "blur": "blurred",
        "binary": "threshold",
        "contours": "contours",
        "angles": "ellipses",
        "reconstruction": "reconstruction"
    }

    debug_files = glob.glob(os.path.join(DEBUG_FOLDER, "*.png"))

    for file in debug_files:
        name = os.path.basename(file).lower()

        for keyword, step_name in file_map.items():
            if keyword in name:
                steps[step_name] = file

    # ✅ 3. Match only current run output files
    final_image = None
    summary_text = ""

    base_name = os.path.basename(image_path).split(".")[0]

    for file in os.listdir(output_folder):
        full_path = os.path.join(output_folder, file)
        name = file.lower()

        # Final analyzed output image
        if (
            base_name in name
            and "analyzed" in name
            and file.endswith(".jpg")
        ):
            final_image = full_path

        # Summary text file
        elif (
            base_name in name
            and "summary" in name
            and file.endswith(".txt")
        ):
            try:
                with open(full_path, "r") as f:
                    summary_text = f.read()

            except Exception as e:
                print(f"⚠️ Could not read summary: {e}")

    # 🔍 Debug logs
    print("📂 Steps:", steps)
    print("🖼 Final image:", final_image)
    print("📄 Summary length:", len(summary_text))
    print("📊 Raw Summary:", summary)

    # ✅ Return clean structured values for frontend
    return {
        "steps": steps,

        "metrics": {
            # real forensic values from pipeline
            "total_stains": summary.get("total_stains"),
            "mean_angle": summary.get("mean_angle"),
            "min_angle": summary.get("min_angle"),
            "max_angle": summary.get("max_angle"),
            "area_of_origin": summary.get("area_of_origin"),

            # optional stain classifications
            "circular": summary.get("circular"),
            "elliptical": summary.get("elliptical"),
            "elongated": summary.get("elongated"),
            "shallow": summary.get("shallow")
        },

        "final_image": final_image,
        "summary_text": summary_text
    }