# zodiac_data.py

zodiac_music_mapping = {
    "Aries": {"instrument": "synth", "scale": "lydian", "tempo": 140, "attack": 0.1, "rhythm": "steady"},
    "Taurus": {"instrument": "piano", "scale": "ionian", "tempo": 90, "attack": 0.05, "rhythm": "syncopated"},
    "Gemini": {"instrument": "pluck", "scale": "mixolydian", "tempo": 120, "attack": 0.2, "rhythm": "arpeggiated"},
    "Cancer": {"instrument": "pad", "scale": "dorian", "tempo": 80, "attack": 0.1, "rhythm": "steady"},
    "Leo": {"instrument": "synth", "scale": "lydian", "tempo": 140, "attack": 0.05, "rhythm": "syncopated"},
    "Virgo": {"instrument": "piano", "scale": "ionian", "tempo": 90, "attack": 0.2, "rhythm": "arpeggiated"},
    "Libra": {"instrument": "pluck", "scale": "mixolydian", "tempo": 120, "attack": 0.1, "rhythm": "steady"},
    "Scorpio": {"instrument": "pad", "scale": "dorian", "tempo": 80, "attack": 0.05, "rhythm": "syncopated"},
    "Sagittarius": {"instrument": "synth", "scale": "lydian", "tempo": 140, "attack": 0.2, "rhythm": "arpeggiated"},
    "Capricorn": {"instrument": "piano", "scale": "ionian", "tempo": 90, "attack": 0.1, "rhythm": "steady"},
    "Aquarius": {"instrument": "pluck", "scale": "mixolydian", "tempo": 120, "attack": 0.05, "rhythm": "syncopated"},
    "Pisces": {"instrument": "pad", "scale": "dorian", "tempo": 80, "attack": 0.2, "rhythm": "arpeggiated"}
}

planet_music_effects = {
    "Sun": {"intensity": 1.2, "brightness": 1.3, "motif": "heroic"},
    "Moon": {"intensity": 0.8, "brightness": 0.9, "motif": "reflective"},
    "Mercury": {"intensity": 1.0, "brightness": 1.1, "motif": "playful"},
    "Venus": {"intensity": 0.9, "brightness": 1.2, "motif": "romantic"},
    "Mars": {"intensity": 1.3, "brightness": 1.1, "motif": "driving"},
    "Jupiter": {"intensity": 1.1, "brightness": 1.4, "motif": "expansive"},
    "Saturn": {"intensity": 0.7, "brightness": 0.6, "motif": "serious"},
    "Uranus": {"intensity": 1.0, "brightness": 1.5, "motif": "experimental"},
    "Neptune": {"intensity": 0.6, "brightness": 1.0, "motif": "dreamlike"},
    "Pluto": {"intensity": 1.4, "brightness": 0.7, "motif": "transformative"},
    "North Node": {"intensity": 1.0, "brightness": 1.0, "motif": "karmic"},
    "South Node": {"intensity": 1.0, "brightness": 0.9, "motif": "ancestral"},
    "Chiron": {"intensity": 0.8, "brightness": 0.8, "motif": "healing"}
}

HOUSE_MUSIC_RULES = {
    1: {"theme": "Self / Identity", "mood": "Bold, fresh", "harmony": "Simple, open", "spatial": "Center-forward", "dynamics": "Medium"},
    2: {"theme": "Resources / Value", "mood": "Grounded", "harmony": "Stable, repeated", "spatial": "Low + warm", "dynamics": "Low"},
    3: {"theme": "Communication", "mood": "Light, curious", "harmony": "Bouncy, staccato", "spatial": "Stereo playful", "dynamics": "Mid"},
    4: {"theme": "Home / Roots", "mood": "Introspective", "harmony": "Soft, warm chords", "spatial": "Reverb-heavy", "dynamics": "Low"},
    5: {"theme": "Creativity / Romance", "mood": "Bright, playful", "harmony": "Lush, expressive", "spatial": "Forward, sparkly", "dynamics": "High"},
    6: {"theme": "Work / Routine", "mood": "Mechanical, clean", "harmony": "Minimal harmony", "spatial": "Panned mid-low", "dynamics": "Medium"},
    7: {"theme": "Partnerships", "mood": "Harmonious", "harmony": "Balanced duets", "spatial": "Mid-centered", "dynamics": "Medium"},
    8: {"theme": "Intimacy / Power", "mood": "Intense", "harmony": "Dissonance + resolve", "spatial": "Deep reverb", "dynamics": "High"},
    9: {"theme": "Philosophy / Travel", "mood": "Expansive", "harmony": "Modal, layered", "spatial": "Wide stereo", "dynamics": "High"},
    10: {"theme": "Career / Purpose", "mood": "Driven, regal", "harmony": "Anthemic chords", "spatial": "Center top", "dynamics": "Strong"},
    11: {"theme": "Society / Vision", "mood": "Experimental", "harmony": "Arpeggiated loops", "spatial": "Circular pan", "dynamics": "Variable"},
    12: {"theme": "Subconscious / Spirit", "mood": "Dreamlike", "harmony": "Ambient drones", "spatial": "Distant, foggy", "dynamics": "Low"}
}
# The above data is used to generate a musical profile based on astrological data.