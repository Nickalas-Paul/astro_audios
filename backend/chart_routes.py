from flask import Blueprint, request, jsonify
from datetime import datetime
import requests
from flask_cors import CORS
from app.utils.utils import get_access_token, convert_vedic_to_western, validate_birth_data

chart_routes = Blueprint('chart_routes', __name__)
CORS(chart_routes)

@chart_routes.route('/api/astro', methods=['POST'])
def get_astro_data():
    """Fetch natal chart data from the external API, convert it, and return both Vedic and Western data."""
    data = request.get_json() or {}
    birth_data = data.get('birthData') or data

    # 1) Validate date, time, lat, lon
    is_valid, message = validate_birth_data(birth_data)
    if not is_valid:
        return jsonify({"status": "error", "message": message}), 400

    # 2) Parse datetime
    date_str = birth_data['date']
    time_str = birth_data['time']
    try:
        dt_obj = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        datetime_str = dt_obj.isoformat() + "+00:00"
    except ValueError:
        return jsonify({"status": "error", "message": "Invalid date/time format"}), 400

    # 3) Use flat lat/lon
    latitude = birth_data['lat']
    longitude = birth_data['lon']

    # 4) Prepare external API call
    params = {
        "ayanamsa": 1,
        "coordinates": f"{latitude},{longitude}",
        "datetime": datetime_str
    }
    try:
        token = get_access_token()
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(
            'https://api.prokerala.com/v2/astrology/kundli',
            headers=headers,
            params=params
        )
        resp.raise_for_status()
        vedic = resp.json().get("data", {})
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to fetch astro data: {e}"}), 500

    # 5) Convert and return
    western = convert_vedic_to_western(vedic)
    return jsonify({
        "status": "ok",
        "vedic": vedic,
        "western": western
    })
