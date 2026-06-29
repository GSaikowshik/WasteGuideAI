from flask import Blueprint, request, jsonify
from services.groq_service import analyze_waste
from services.firebase_service import save_scan, get_history
from services.centers_service import get_collection_centers

waste_bp = Blueprint("waste", __name__)


@waste_bp.route("/scan", methods=["POST"])
def scan_waste():
    try:
        data = request.get_json()
        if not data or "item" not in data or not data["item"].strip():
            return jsonify({
                "success": False,
                "message": "Invalid input. Please provide a valid 'item' name."
            }), 400

        item = data["item"].strip()
        
        # 1. Call AI Waste Scanner
        result = analyze_waste(item)
        
        # 2. Save scanned item details to Firebase
        save_scan(result)
        
        return jsonify({
            "success": True,
            "data": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500


@waste_bp.route("/history", methods=["GET"])
def history():
    try:
        scan_history = get_history()
        return jsonify({
            "success": True,
            "data": scan_history
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500


@waste_bp.route("/centers", methods=["GET"])
def centers():
    try:
        centers_data = get_collection_centers()
        return jsonify({
            "success": True,
            "data": centers_data
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500