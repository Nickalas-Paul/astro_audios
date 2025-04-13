# backend/app/routes/music_routes.py
from flask import Blueprint, jsonify, request
from app.utils.utils import generate_music

music_routes = Blueprint('music_routes_bp', __name__)

@music_routes.route('/music', methods=['POST'])
def generate_music_route():
    """Generate music based on the given seed sequence."""
    data = request.get_json()
    seed_sequence = data.get('seed_sequence', [])
    length = data.get('length', 100)

    if not seed_sequence:
        return jsonify({"status": "error", "message": "No seed sequence provided"}), 400

    try:
        generated_music = generate_music(seed_sequence, length)
        return jsonify({"status": "ok", "music": generated_music})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500