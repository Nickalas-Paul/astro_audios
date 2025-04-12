import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load the trained model
def load_model():
    model = Sequential([
        LSTM(128, input_shape=(50, 128), return_sequences=True),
        LSTM(128),
        Dense(128, activation='softmax')
    ])
    try:
        model.load_weights("model_weights.weights.h5")
        print("✅ Model loaded successfully.")
        return model
    except FileNotFoundError:
        print("❌ Error: model_weights.weights.h5 not found.")
        return None

# Generate a music sequence
def generate_music(seed_sequence, length=100):
    model = load_model()
    if model is None:
        return []  # Return empty list if model not loaded

    generated_sequence = []

    # Start with the seed sequence
    current_sequence = seed_sequence

    for _ in range(length):
        # Pad the sequence to ensure consistent length
        padded_sequence = pad_sequences([current_sequence], maxlen=50, padding='pre')

        # Predict the next note
        predicted = model.predict(padded_sequence, verbose=0)[0]

        # Sample the next note
        next_note = np.argmax(predicted)
        generated_sequence.append(next_note)

        # Update the current sequence
        current_sequence = np.append(current_sequence, [next_note])

        # Maintain the sequence length
        if len(current_sequence) > 50:
            current_sequence = current_sequence[1:]

    return generated_sequence

if __name__ == "__main__":
    # Example seed sequence
    seed_sequence = np.random.randint(0, 128, size=(50,)).tolist()
    generated_music = generate_music(seed_sequence, length=100)
    print("Generated Music Sequence:", generated_music)
