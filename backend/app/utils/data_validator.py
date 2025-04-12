def validate_birth_data(data):
    """
    Validates the structure and content of the birth data.
    Args:
        data (dict): The birth data obtained from the frontend.
    Returns:
        bool: True if the data is valid, False otherwise.
        str: Error message if validation fails.
    """
    required_keys = ["date", "time", "location"]
    for key in required_keys:
        if key not in data or not data[key]:
            return False, f"Missing or empty field: {key}"

    try:
        datetime.strptime(data["date"], "%Y-%m-%d")
        datetime.strptime(data["time"], "%H:%M")
    except ValueError:
        return False, "Invalid date or time format. Expected YYYY-MM-DD and HH:MM."
    
    return True, "Data is valid"
