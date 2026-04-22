from flask import Flask, send_file, request, jsonify
from flask_cors import CORS
import os
import uuid

from services.pipeline_service import run_cv

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/result/<filename>")
def get_result(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename))


@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Save uploaded file
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Run CV pipeline
    result = run_cv(filepath, OUTPUT_FOLDER)

    return jsonify({
        "method": "cv",
        "result": result
    })


if __name__ == "__main__":
    app.run(debug=True)