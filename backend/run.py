import sys
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Import your blueprints and routes
from chart_routes import chart_routes
app.register_blueprint(chart_routes)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

# Add parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
