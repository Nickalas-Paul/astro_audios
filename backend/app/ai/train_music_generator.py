import numpy as np
from music_generator import build_model, NOTE_MAPPING

def generate_training_data():
    """Generate dummy training data for the LSTM."""
    data = []
    labels = []

    for _ in range(1000):
        sequence = np.random.randint(0, len(NOTE_MAPPING), size=(50,))
        data.append(sequence)
        labels.append(sequence[-1])

    X = np.array(data).reshape((-1, 50, 1))
    y = np.array(labels)
    return X, y

X, y = generate_training_data()
model = build_model((50, 1))
model.fit(X, y, epochs=10)

model.save_weights("model_weights.weights.h5")
print("Model training complete and weights saved.")
