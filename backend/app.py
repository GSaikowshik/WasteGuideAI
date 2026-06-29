import os
from dotenv import load_dotenv, find_dotenv

# Load environment variables from the root or local .env file
load_dotenv(find_dotenv())

from flask import Flask
from flask_cors import CORS
from routes.waste_routes import waste_bp

app = Flask(__name__)
# Enable CORS for all routes under /api, specifically from Vite local server
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Register blueprint with prefix
app.register_blueprint(waste_bp, url_prefix="/api")

@app.get("/")
def home():
    return {
        "success": True,
        "message": "WasteGuide AI Backend Running on Port 5000"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)