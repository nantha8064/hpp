import os
import joblib
from flask import Flask, jsonify, render_template, request
import pandas as pd

app = Flask(__name__)

# Safely route and map path dependencies
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

# --- MODEL LOADING SAFETY SHIELD ---
# Prevents Flask from crashing if the model.pkl file has not been generated yet
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None
    print("\n" + "="*70)
    print("⚠️  WARNING: 'model.pkl' not found inside the project directory!")
    print("Please run 'python train_model.py' first to generate your model file.")
    print("="*70 + "\n")


@app.route("/")
def home():
    """Renders the central center-aligned prediction application template interface."""
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    """Accepts advanced multi-grid parameter payloads from javascript fetch pipelines

    and evaluates property valuation variables.
    """
    global model
    
    # Lazy-reload handler check in case model file was generated while server was running
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            return jsonify({"error": "Machine learning model file (model.pkl) is missing on the server. Please run train_model.py first."}), 500

    try:
        data = request.get_json()

        # Catch instances where payload transmissions return unreadable anomalies
        if not data:
            return jsonify({"error": "No specification data provided."}), 400

        # Construct DataFrame matching the exact array keys expected by your model pipeline
        input_df = pd.DataFrame(
            [
                {
                    "city": data["city"],
                    "buildingArea": float(data["buildingArea"]),
                    "totalArea": float(data["totalArea"]),
                    "bedrooms": int(data["bedrooms"]),
                    "bathrooms": int(data["bathrooms"]),
                    "floors": int(data["floors"]),
                    "parking": int(data["parking"]),
                    "age": int(data["age"]),
                    "furnishing": data["furnishing"],
                }
            ]
        )

        # 1. Evaluate baseline machine learning model valuation
        prediction_array = model.predict(input_df)
        base_prediction = float(prediction_array[0])

        # 2. Location Intelligence - Micro Locality Premium Weights Matrix Mapping
        # Modulates the real estate valuation dynamically depending on neighborhood premiums
        locality_premiums = {
            "Adyar": 1.35, "Anna Nagar": 1.25, "RS Puram": 1.22, "Ramanathapuram": 1.15,
            "Thillai Nagar": 1.18, "Fairlands": 1.12, "Srirangam": 1.10, "Velachery": 1.15,
            "T Nagar": 1.30, "Gandhipuram": 1.16, "Cantonment": 1.14, "Hasthampatti": 1.08
        }
        
        user_locality = data.get("locality", "Standard")
        premium_multiplier = locality_premiums.get(user_locality, 1.0)
        final_price = base_prediction * premium_multiplier

        # 3. Smarter AI - Dynamic Feature Impact Calculations
        # FIX: Changed Math.round (JavaScript syntax) to round() (Python syntax)
        feature_impacts = {
            "space_impact": round(float(data["buildingArea"]) * 4800),
            "room_impact": int(data["bedrooms"]) * 250000,
            "parking_impact": int(data["parking"]) * 120000,
            "depreciation": int(data["age"]) * -45000
        }


        # Returns final price along with feature impact variables for frontend analytics
        return jsonify({
            "price": float(final_price),
            "impacts": feature_impacts
        })

    except KeyError as key_err:
        # Detects missing or malformed input properties instantly
        return (
            jsonify({"error": f"Missing required parameter slot: {str(key_err)}"}),
            400,
        )
    except Exception as err:
        # Fallback security shield to catch calculation or model type errors cleanly
        return jsonify({"error": f"Internal Valuation Engine Error: {str(err)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
