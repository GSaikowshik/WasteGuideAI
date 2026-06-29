import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Check if firebase_key.json exists, otherwise use in-memory mockup
FIREBASE_MOCK_MODE = not os.path.exists("firebase_key.json")

if not FIREBASE_MOCK_MODE:
    try:
        # Initialize Firebase only once
        if not firebase_admin._apps:
            cred = credentials.Certificate("firebase_key.json")
            firebase_admin.initialize_app(cred)
        db = firestore.client()
    except Exception as e:
        print(f"Firebase initialization failed: {e}. Switching to in-memory Mock Mode.")
        FIREBASE_MOCK_MODE = True
        db = None
else:
    print("firebase_key.json not found. Backend running with in-memory Mock database.")
    db = None

# In-memory storage for mock database
_in_memory_scans = []

def save_scan(data):
    if FIREBASE_MOCK_MODE:
        scan_entry = {
            "id": f"mock_scan_{len(_in_memory_scans) + 1}",
            "item": data.get("item"),
            "category": data.get("category"),
            "recyclable": data.get("recyclable"),
            "hazard": data.get("hazard"),
            "ecoSuggestion": data.get("ecoSuggestion"),
            "disposalSteps": data.get("disposalSteps", []),
            "recyclingInstructions": data.get("recyclingInstructions", []),
            "timestamp": datetime.utcnow()
        }
        _in_memory_scans.append(scan_entry)
        print(f"[Mock DB] Saved scan: {data.get('item')}")
    else:
        db.collection("history").add({
            "item": data.get("item"),
            "category": data.get("category"),
            "recyclable": data.get("recyclable"),
            "hazard": data.get("hazard"),
            "ecoSuggestion": data.get("ecoSuggestion"),
            "disposalSteps": data.get("disposalSteps", []),
            "recyclingInstructions": data.get("recyclingInstructions", []),
            "timestamp": datetime.utcnow()
        })


def get_history():
    if FIREBASE_MOCK_MODE:
        # Return history sorted by timestamp descending
        history = []
        for scan in sorted(_in_memory_scans, key=lambda x: x["timestamp"], reverse=True):
            entry = scan.copy()
            entry["timestamp"] = entry["timestamp"].isoformat()
            history.append(entry)
        return history
    else:
        docs = db.collection("history") \
            .order_by("timestamp", direction=firestore.Query.DESCENDING) \
            .stream()

        history = []

        for doc in docs:

            data = doc.to_dict()
            data["id"] = doc.id

            # Convert datetime to ISO string
            if "timestamp" in data and data["timestamp"]:
                data["timestamp"] = data["timestamp"].isoformat()

            history.append(data)

        return history