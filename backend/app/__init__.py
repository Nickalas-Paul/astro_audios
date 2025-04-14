from flask import Flask
from flask_cors import CORS
from app.routes.music_routes import music_routes

app = Flask(__name__)
app.register_blueprint(music_routes)

# ✅ This allows your GitHub Codespace frontend
CORS(app, origins=[
    "https://glowing-orbit-7ww6gjvj6vfr44p-3000.app.github.dev"
])
