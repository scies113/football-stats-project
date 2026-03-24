from flask import Flask, request, jsonify
import torch
import numpy as np
import joblib
import os

from model import FootballPredictor, init_model

app = Flask(__name__)

device = torch.device("cpu")
model_path = "data/models/model.pth"
scaler_path = "data/scaler.pkl"

model = None
scaler = None

if os.path.exists(model_path) and os.path.exists(scaler_path):
    model = init_model()
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    scaler = joblib.load(scaler_path)
    print("Модель и скейлер загружена!")
else:
    print("Модель не найдена, обучаем...")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    })

@app.route("/predict", methods=["POST"])
def predict():
    if model is None or scaler is None:
        return jsonify({"error": "Model or scaler not loaded. Run train.py first"}), 500

    try:
        data = request.json
        home_form = data.get('home_form', [])
        away_form = data.get('away_form', [])

        features = prepare_features(home_form, away_form)
        features_tensor = torch.FloatTensor([features]).to(device)

        with torch.no_grad():
            probs = model(features_tensor).cpu().numpy()[0]

        result = {
            "home_win_prob": float(probs[0]),
            "away_win_prob": float(probs[2]),
            "draw_prob": float(probs[1]),
            "predicted_winner": "home" if probs[0] > max(probs[1], probs[2]) else "draw" if probs[1] > probs[2] else "away",
            "confidence": float(max(probs))
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

def prepare_features(home_form, away_form):
    """30 фич: форма 5 матчей (xg, goals, possession)"""
    features = []

    for team_form in [home_form[:5], away_form[:5]]:
        for match in team_form:
            features.extend([
                match.get('xg', 0.0),
                match.get('goals', 0),
                match.get('possession', 50.0)
            ])

    while len(features) < 30:
        features.append(0.0)

    features = features[:30]

    features = scaler.transform([features])[0]

    return features

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)