import sys
import os

# Add parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from flask import Flask
from flask_cors import CORS
from backend.chart_routes import chart_routes  # Adjusted import path to include the backend folder

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register your blueprint
app.register_blueprint(chart_routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
