import sys
import os

# Adjust the Python path to include the parent directory for proper imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app  # Import the Flask app instance
from app.routes.chart_routes import chart_routes
from app.routes.music_routes import music_routes

# Register the blueprints
app.register_blueprint(chart_routes)
app.register_blueprint(music_routes)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
