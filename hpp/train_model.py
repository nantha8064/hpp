import os
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

# Locate system workspace routing directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "house_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

# --- DATA VERIFICATION ENGINE ---
# Automatically searches for your updated HTML layout column names.
# Generates realistic square-footage data if a dataset doesn't exist yet.
try:
    data = pd.read_csv(CSV_PATH)
    # Checked against your new advanced HTML input field name definitions
    required_cols = [
        "city",
        "buildingArea",
        "totalArea",
        "bedrooms",
        "bathrooms",
        "floors",
        "parking",
        "age",
        "furnishing",
        "price",
    ]
    if not all(col in data.columns for col in required_cols):
        raise ValueError("CSV columns do not match your new HTML features.")
except Exception:
    print("Generating updated simulated dataset matching your new grid columns...")
    np.random.seed(42)
    
    # Bounded to 5,000 samples to prevent system MemoryErrors/RAM crashes.
    n_samples = 5000

    # Building realistic square-footage variations bounded by your 100 Cents (43560 Sq.Ft) tracking profile
    total_area = np.random.uniform(500.0, 43560.0, n_samples)
    # Ensuring building area doesn't transcend total land space footprint limits
    building_area = total_area * np.random.uniform(0.55, 0.92, n_samples)
    # Cap building area at your maximum constraint of 43560 Sq.Ft
    building_area = np.clip(building_area, 100, 43560)

    mock_data = {
        "city": np.random.choice(
            ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"], n_samples
        ),
        "buildingArea": building_area,
        "totalArea": total_area,
        "bedrooms": np.random.randint(1, 6, n_samples),
        "bathrooms": np.random.randint(1, 5, n_samples),
        "floors": np.random.randint(1, 4, n_samples),
        "parking": np.random.randint(0, 3, n_samples),
        "age": np.random.randint(0, 30, n_samples),
        "furnishing": np.random.choice(
            ["Unfurnished", "Semi-Furnished", "Fully Furnished"], n_samples
        ),
    }

    # Advanced synthetic real estate valuation algorithm modeling
    # Base rate per square foot + structure upgrades - age depreciation (Synchronized with app.py)
    mock_data["price"] = (
        (mock_data["buildingArea"] * 4800)
        + (mock_data["totalArea"] * 1500)
        + (mock_data["bedrooms"] * 250000)
        + (mock_data["bathrooms"] * 150000)
        + (mock_data["parking"] * 120000)
        - (mock_data["age"] * 45000)
    )

    # Floor ceiling to prevent negative simulated valuations on dilapidated assets
    mock_data["price"] = np.clip(mock_data["price"], 600000, None)

    data = pd.DataFrame(mock_data)
    data.to_csv(CSV_PATH, index=False)

# Define feature arrays targeting the updated structure
X = data[
    [
        "city",
        "buildingArea",
        "totalArea",
        "bedrooms",
        "bathrooms",
        "floors",
        "parking",
        "age",
        "furnishing",
    ]
]
y = data["price"]

categorical_features = ["city", "furnishing"]
numeric_features = [
    "buildingArea",
    "totalArea",
    "bedrooms",
    "bathrooms",
    "floors",
    "parking",
    "age",
]

# Categorical mapping encoding pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ("num", "passthrough", numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ]
)

# Model configuration architecture
model = Pipeline(
    [
        ("preprocessor", preprocessor),
        (
            "regressor",
            RandomForestRegressor(
                n_estimators=100, random_state=42, n_jobs=-1
            ),
        ),
    ]
)

# Split execution mapping
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit and evaluate performance
print("Training new customized house price predictor model pipeline...")
model.fit(X_train, y_train)
predictions = model.predict(X_test)
print("Model R² Valuation Prediction Accuracy Score:", r2_score(y_test, predictions))

# Export the compiled machine learning artifact
joblib.dump(model, MODEL_PATH)
print(f"Model successfully processed and saved at: {MODEL_PATH}")
