from flask import Flask
from flask_cors import CORS

from routes.waste_routes import waste_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(waste_bp)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "WasteGuide AI Backend Running"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)