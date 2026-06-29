from flask import Blueprint, request, jsonify
from services.groq_service import analyze_waste
from services.firebase_service import save_scan, get_history, delete_scan
from services.centers_service import get_collection_centers

waste_bp = Blueprint("waste", __name__)


def get_current_user():
    # Retrieve user ID from headers (supporting x-user-id or Authorization bearer token)
    user_id = request.headers.get("x-user-id")
    if not user_id:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            user_id = auth_header[7:].strip()
    return user_id


@waste_bp.route("/scan", methods=["POST"])
def scan_waste():
    try:
        user_id = get_current_user()
        if not user_id:
            return jsonify({
                "success": False,
                "message": "Unauthorized. Missing user authentication token or ID."
            }), 401

        data = request.get_json()
        if not data or "item" not in data or not data["item"].strip():
            return jsonify({
                "success": False,
                "message": "Invalid input. Please provide a valid 'item' name."
            }), 400

        item = data["item"].strip()
        
        # 1. Call AI Waste Scanner
        result = analyze_waste(item)
        
        # 2. Save scanned item details to Firebase under user_id
        save_scan(result, user_id)
        
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
        user_id = get_current_user()
        if not user_id:
            return jsonify({
                "success": False,
                "message": "Unauthorized. Missing user authentication token or ID."
            }), 401

        scan_history = get_history(user_id)
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
        # Map centers are public, no user scoping required
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


@waste_bp.route("/history/<string:scan_id>", methods=["DELETE"])
def delete_history_item(scan_id):
    try:
        user_id = get_current_user()
        if not user_id:
            return jsonify({
                "success": False,
                "message": "Unauthorized. Missing user authentication token or ID."
            }), 401

        status = delete_scan(scan_id, user_id)
        if status is True:
            return jsonify({
                "success": True,
                "message": "Scan history item deleted successfully."
            }), 200
        elif status is False:
            return jsonify({
                "success": False,
                "message": "Unauthorized. You cannot delete this item."
            }), 403
        else:
            return jsonify({
                "success": False,
                "message": "Scan history item not found."
            }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500