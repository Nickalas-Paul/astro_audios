from flask import Blueprint, request, jsonify
from app.utils.utils import get_musical_profile

music_routes = Blueprint('music_routes', __name__)

@music_routes.route('/api/music-profile', methods=['POST'])
def generate_music_profile():
    try:
        data = request.get_json()
        chart = data.get("chart")  # Expect list of {planet, sign, house}

        if not chart:
            return jsonify({"status": "error", "message": "Missing or invalid 'chart' data."}), 400

        profile = []
        for item in chart:
            planet = item.get("planet")
            sign = item.get("sign")
            house = item.get("house")

            if not sign or not house:
                continue  # skip incomplete entries

            # If planet is "None" or blank, don't apply planetary influence
            use_planet = planet if planet and planet != "None" else "Sun"  # default to Sun to get a valid profile
            entry = get_musical_profile(use_planet, sign, house)

            # Remove planet-based attributes if planet was omitted
            if planet in [None, "", "None"]:
                for key in ["planet", "motif", "intensity", "brightness"]:
                    entry.pop(key, None)
            else:
                entry["planet"] = planet  # Ensure true planet is returned

            profile.append(entry)

        return jsonify({"status": "ok", "profile": profile})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
