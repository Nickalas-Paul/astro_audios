# backend/run.py

import sys
import os
from dotenv import load_dotenv
load_dotenv()

# ─── PATH SETUP ───────────────────────────────────────────────────────────────
# BASE_DIR is the 'backend/' folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# PROJECT_ROOT is one level up (your repo root)
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, os.pardir))

# Insert PROJECT_ROOT *then* BASE_DIR so both imports resolve
sys.path.insert(0, PROJECT_ROOT)
sys.path.insert(0, BASE_DIR)

# ─── FLASK APP SETUP ───────────────────────────────────────────────────────────
from flask import Flask
from flask_cors import CORS
from backend.chart_routes import chart_routes

app = Flask(__name__)
# Allow CORS on all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Register your routes blueprint
app.register_blueprint(chart_routes)

# ─── ENTRYPOINT ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Runs on 127.0.0.1:5000 in debug mode
    app.run(host="0.0.0.0", port=5000, debug=True)
