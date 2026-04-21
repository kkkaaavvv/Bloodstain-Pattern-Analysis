from flask import request, jsonify
import os
import numpy as np
import uuid

from services.yolo_service import run_yolo
from services.pipeline_service import run_cv


#  Helper: convert numpy → python types
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


def register_routes(app, UPLOAD_FOLDER, OUTPUT_FOLDER):

    @app.route("/analyze", methods=["POST"])
    def analyze():
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        #unique filename (important)
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        mode = request.form.get("mode", "cv")

        # YOLO MODE
        if mode == "yolo":
            result = run_yolo(filepath, OUTPUT_FOLDER)

            result = convert_numpy(result)  

            return jsonify({
                "method": "yolo",
                "result": result
            })

        # CV MODE
        else:
            summary = run_cv(filepath, OUTPUT_FOLDER)

            summary = convert_numpy(summary) 

            return jsonify({
                "method": "cv",
                "result": summary
            })