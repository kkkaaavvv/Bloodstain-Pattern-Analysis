from flask import Flask, send_file, request, jsonify
from flask_cors import CORS
import os
import uuid

from services.pipeline_service import run_cv

app = Flask(__name__)

# ✅ Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "results"
DEBUG_FOLDER = "debug_output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return "Backend is running!"


# ✅ Serve final output images
@app.route("/result/<filename>")
def get_result(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename))


# ✅ Serve debug pipeline images
@app.route("/debug/<filename>")
def get_debug(filename):
    return send_file(os.path.join(DEBUG_FOLDER, filename))


@app.route("/analyze", methods=["POST"])
def analyze():
    print("🔥 REQUEST RECEIVED")

    if "file" not in request.files:
        print("❌ No file in request")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Save uploaded file
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    print(f"✅ File saved: {filepath}")

    # Run pipeline
    result = run_cv(filepath, OUTPUT_FOLDER)
    print("✅ CV processing done")

    steps = {}

    # 🔥 Map step images (debug + result)
    for key, value in result.get("steps", {}).items():
        filename = os.path.basename(value)

        result_path = os.path.join(OUTPUT_FOLDER, filename)
        debug_path = os.path.join(DEBUG_FOLDER, filename)

        if os.path.exists(result_path):
            steps[key] = f"http://localhost:5000/result/{filename}"
        elif os.path.exists(debug_path):
            steps[key] = f"http://localhost:5000/debug/{filename}"
        else:
            print(f"❌ File not found: {filename}")

    # 🔥 FINAL IMAGE (safe handling)
    final_image_path = result.get("final_image")
    final_image_url = None

    if final_image_path:
        filename = os.path.basename(final_image_path)
        full_path = os.path.join(OUTPUT_FOLDER, filename)

        if os.path.exists(full_path):
            final_image_url = f"http://localhost:5000/result/{filename}"
        else:
            print(f"❌ Final image missing: {full_path}")

    # 🔥 SUMMARY TEXT
    summary_text = result.get("summary_text", "")

    return jsonify({
        "result": {
            "steps": steps,
            "metrics": result.get("metrics", {}),
            "final_image": final_image_url,
            "summary_text": summary_text
        }
    })


if __name__ == "__main__":
    app.run(debug=True)