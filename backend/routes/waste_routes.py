from flask import Blueprint, request, jsonify

from services.groq_service import analyze_waste
from services.firebase_service import save_scan, get_history

from services.dashboard_service import get_dashboard_data

waste_bp = Blueprint("waste", __name__)


@waste_bp.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    item = data.get("item")

    result = analyze_waste(item)

    # Save AI result to Firestore
    save_scan(result)

    return jsonify(result)


@waste_bp.route("/history", methods=["GET"])
def history():

    history = get_history()

    return jsonify(history)




@waste_bp.route("/dashboard", methods=["GET"])
def dashboard():

    return jsonify(get_dashboard_data())