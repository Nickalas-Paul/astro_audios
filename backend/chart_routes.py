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
    data = request.get_json()
    birth_data = data.get('birthData')

    # Validate the birth data
    is_valid, message = validate_birth_data(birth_data)
    if not is_valid:
        return jsonify({"status": "error", "message": message}), 400

    date_str = birth_data.get('date')
    time_str = birth_data.get('time')

    try:
        dt_obj = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        datetime_str = dt_obj.isoformat() + "+00:00"
    except ValueError:
        return jsonify({"status": "error", "message": "Invalid date/time format"}), 400

    geo = birth_data.get("geolocation", {})
    latitude = geo.get("latitude")
    longitude = geo.get("longitude")

    if not latitude or not longitude:
        return jsonify({"status": "error", "message": "Geolocation data missing"}), 400

    params = {
        "ayanamsa": 1,
        "coordinates": f"{latitude},{longitude}",
        "datetime": datetime_str
    }

    try:
        access_token = get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get('https://api.prokerala.com/v2/astrology/kundli', headers=headers, params=params)
        response.raise_for_status()
        vedic_result = response.json()
    except requests.exceptions.RequestException as e:
        return jsonify({"status": "error", "message": f"Failed to fetch astro data: {str(e)}"}), 500

    vedic_data = vedic_result.get("data", {})
    western_data = convert_vedic_to_western(vedic_data)

    combined_result = {
        "vedic": vedic_data,
        "western": western_data,
        "status": vedic_result.get("status", "ok")
    }
    return jsonify(combined_result)