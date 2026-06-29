import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Try to initialize Firebase
FIREBASE_MOCK_MODE = True
db = None

# Check environment variables (either full JSON string or individual components)
firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS")

firebase_dict = None

if firebase_credentials_json:
    try:
        firebase_dict = json.loads(firebase_credentials_json)
        print("Firebase config loaded from FIREBASE_CREDENTIALS JSON string.")
    except Exception as e:
        print(f"Failed to parse FIREBASE_CREDENTIALS JSON: {e}")

if not firebase_dict:
    project_id = os.getenv("FIREBASE_PROJECT_ID")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    
    if project_id and client_email and private_key:
        firebase_dict = {
            "type": os.getenv("FIREBASE_TYPE", "service_account"),
            "project_id": project_id,
            "private_key": private_key,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        }
        print("Firebase config loaded from individual environment variables.")

if firebase_dict:
    try:
        if "private_key" in firebase_dict and firebase_dict["private_key"]:
            pk = firebase_dict["private_key"]
            # 1. Strip literal quotes that Render might inject from the .env file
            pk = pk.strip('"').strip("'")
            # 2. Replace escaped literal \n with actual newlines
            pk = pk.replace("\\n", "\n")
            firebase_dict["private_key"] = pk
            
        cred = credentials.Certificate(firebase_dict)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        FIREBASE_MOCK_MODE = False
        print("Firebase Admin SDK initialized successfully via environment variables.")
    except Exception as e:
        print(f"Failed to initialize Firebase via env variables: {e}")

# Fallback to local JSON file
if FIREBASE_MOCK_MODE:
    key_path = "firebase_key.json"
    # Try looking in backend directory or parent if needed
    if not os.path.exists(key_path) and os.path.exists("backend/firebase_key.json"):
        key_path = "backend/firebase_key.json"
        
    if os.path.exists(key_path):
        try:
            if not firebase_admin._apps:
                cred = credentials.Certificate(key_path)
                firebase_admin.initialize_app(cred)
            db = firestore.client()
            FIREBASE_MOCK_MODE = False
            print("Firebase Admin SDK initialized successfully via JSON file.")
        except Exception as e:
            print(f"Failed to initialize Firebase via JSON file: {e}")

if FIREBASE_MOCK_MODE:
    print("WARNING: Running Firebase service in Mock Mode with in-memory database.")

# In-memory storage for mock database
_in_memory_scans = []

# Seed with some initial mock scans so the dashboard is not empty on first visit
_in_memory_scans.extend([
    {
        "id": "mock_scan_seed_1",
        "item": "plastic milk jug",
        "category": "Plastic",
        "recyclable": True,
        "hazard": "None",
        "ecoSuggestion": "Choose local dairy products in returnable glass bottles.",
        "disposalSteps": ["Rinse item thoroughly", "Crush to reduce volume", "Place in the recycling bin"],
        "recyclingInstructions": ["Check for PET 1 or HDPE 2 symbols", "Re-attach the cap after rinsing"],
        "timestamp": datetime.utcnow()
    },
    {
        "id": "mock_scan_seed_2",
        "item": "banana peel",
        "category": "Organic / Food Waste",
        "recyclable": False,
        "hazard": "None",
        "ecoSuggestion": "Compost kitchen scraps to create rich soil for house plants.",
        "disposalSteps": ["Place in compost bin", "Do not mix with plastics or metals"],
        "recyclingInstructions": ["Organic composting only"],
        "timestamp": datetime.utcnow()
    },
    {
        "id": "mock_scan_seed_3",
        "item": "aa battery",
        "category": "Hazardous / E-Waste",
        "recyclable": True,
        "hazard": "High (Contains heavy metals)",
        "ecoSuggestion": "Consider purchasing rechargeable NiMH batteries to reduce heavy metal waste.",
        "disposalSteps": ["Store in a dry cool place", "Take to local electronics drop-off"],
        "recyclingInstructions": ["Specialist processing required", "Do not throw in general rubbish"],
        "timestamp": datetime.utcnow()
    }
])


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
        history = []
        for scan in sorted(_in_memory_scans, key=lambda x: x["timestamp"], reverse=True):
            entry = scan.copy()
            if isinstance(entry["timestamp"], datetime):
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
            if "timestamp" in data and data["timestamp"]:
                # If Firestore returns a datetime object, convert it to isoformat
                if hasattr(data["timestamp"], "isoformat"):
                    data["timestamp"] = data["timestamp"].isoformat()
                else:
                    data["timestamp"] = str(data["timestamp"])
            history.append(data)
        return history