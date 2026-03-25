from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import numpy as np

from main import run_pipeline  # your existing function

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # 🔥 Helper function (INSIDE or outside is fine, but properly indented)
    def convert_numpy(obj):
        if isinstance(obj, dict):
            return {k: convert_numpy(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_numpy(i) for i in obj]
        elif isinstance(obj, tuple):
            return tuple(convert_numpy(i) for i in obj)
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        else:
            return obj

    # Run pipeline
    summary, _ = run_pipeline(filepath, output_dir=OUTPUT_FOLDER)

    # Convert numpy → python
    summary = convert_numpy(summary)

    return jsonify({
        "message": "Analysis complete",
        "summary": summary,
        "image": os.path.basename(summary["output_image"])
    })

@app.route("/result/<filename>")
def get_result(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename))


if __name__ == "__main__":
    app.run(debug=True)