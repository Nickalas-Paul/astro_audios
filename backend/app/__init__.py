from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# ✅ This allows your GitHub Codespace frontend
CORS(app, origins=[
    "https://glowing-orbit-7ww6gjvj6vfr44p-3000.app.github.dev"
])
