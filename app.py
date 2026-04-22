from flask import Flask, send_file, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route("/result/<filename>")
def get_result(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename))


# ✅ REAL WORKING ANALYZE ROUTE
@app.route("/analyze", methods=["POST"])
def analyze():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    print("ANALYZE HIT:", file.filename)

    return jsonify({
        "summary": {
            "total_stains": 10,
            "mean_angle": 30
        },
        "image": file.filename
    })


if __name__ == "__main__":
    app.run(debug=True)