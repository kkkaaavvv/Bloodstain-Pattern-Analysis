from flask import Flask, send_file
from flask_cors import CORS
import os

from routes.analyze import register_routes

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Register routes (THIS handles /analyze)
register_routes(app, UPLOAD_FOLDER, OUTPUT_FOLDER)


@app.route("/result/<filename>")
def get_result(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename))


if __name__ == "__main__":
    app.run(debug=True)