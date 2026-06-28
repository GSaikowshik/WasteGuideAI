import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


def save_scan(data):
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