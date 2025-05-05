import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from a .env file


# Load API credentials and URLs from environment variables
ASTRO_CLIENT_ID = os.environ.get('ASTRO_CLIENT_ID', '85400dde-a3d3-4bdc-9e30-ecf1ad721f0c')
ASTRO_CLIENT_SECRET = os.environ.get('ASTRO_CLIENT_SECRET', 'QZ02xGLTlDPFzhq5s5tOSN6bTJnvsdVu1Teao83u')
ASTRO_TOKEN_URL = os.environ.get('ASTRO_TOKEN_URL', 'https://api.prokerala.com/token')
ASTRO_NATAL_CHART_URL = os.environ.get('ASTRO_NATAL_CHART_URL', 'https://api.prokerala.com/v2/astrology/kundli')

def get_access_token():
    """Obtain an access token from the external astrology API."""
    try:
        payload = {
            "grant_type": "client_credentials",
            "client_id": ASTRO_CLIENT_ID,
            "client_secret": ASTRO_CLIENT_SECRET
        }
        response = requests.post(ASTRO_TOKEN_URL, data=payload)
        response.raise_for_status()
        token_data = response.json()
        return token_data.get("access_token")
    except Exception as e:
        print(f"Error obtaining access token: {e}")
        return None

def convert_vedic_to_western(vedic_data):
    """Convert Vedic chart data to Western chart data."""
    zodiac_mapping = {
        "Mesha": "Aries",
        "Vrishabha": "Taurus",
        "Mithuna": "Gemini",
        "Karka": "Cancer",
        "Simha": "Leo",
        "Kanya": "Virgo",
        "Tula": "Libra",
        "Vrishchika": "Scorpio",
        "Dhanu": "Sagittarius",
        "Makara": "Capricorn",
        "Kumbha": "Aquarius",
        "Meena": "Pisces"
    }
    western_data = {}
    nakshatra_details = vedic_data.get("nakshatra_details", {})
    chandra_rasi = nakshatra_details.get("chandra_rasi", {})
    if "name" in chandra_rasi:
        vedic_sign = chandra_rasi["name"]
        western_data["chandra_rasi"] = zodiac_mapping.get(vedic_sign, vedic_sign)
    soorya_rasi = nakshatra_details.get("soorya_rasi", {})
    if "name" in soorya_rasi:
        vedic_sign = soorya_rasi["name"]
        western_data["soorya_rasi"] = zodiac_mapping.get(vedic_sign, vedic_sign)
    return western_data
def get_musical_profile(planet: str, sign: str, house: int):
    from app.utils.zodiac_data import zodiac_music_mapping
    from app.utils.zodiac_data import planet_music_effects
    from app.utils.zodiac_data import HOUSE_MUSIC_RULES

    planet_data = planet_music_effects.get(planet, {})
    sign_data = zodiac_music_mapping.get(sign, {})
    house_data = HOUSE_MUSIC_RULES.get(house, {})

    if not planet_data or not sign_data or not house_data:
        return {"error": "Invalid planet, sign, or house provided."}

    musical_profile = {
        "planet": planet,
        "sign": sign,
        "house": house,
        "motif": planet_data["motif"],
        "intensity": planet_data["intensity"],
        "brightness": planet_data["brightness"],
        "instrument": sign_data["instrument"],
        "scale": sign_data["scale"],
        "tempo": sign_data["tempo"],
        "attack": sign_data["attack"],
        "rhythm": sign_data["rhythm"],
        "mood": house_data["mood"],
        "harmony": house_data["harmony"],
        "spatial": house_data["spatial"],
        "dynamics": house_data["dynamics"],
        "theme": house_data["theme"]
    }

    return musical_profile

def validate_birth_data(data):
    """
    Ensure we got date, time, lat, and lon.
    """
    # must be a dict
    if not isinstance(data, dict):
        return False, "Request body must be an object"

    required_keys = ["date", "time", "lat", "lon"]
    for key in required_keys:
        if key not in data or data[key] in (None, ""):
            return False, f"Missing or empty field: {key}"

    # Optionally: you can also validate formats here (date/time parsing, lat/lon numeric)
    return True, ""

def generate_music(input_data=None):
    """Placeholder for music generation logic."""
    print("generate_music() was called with:", input_data)
    return {"status": "pending", "message": "Music generation not yet implemented."}
