from collections import Counter
from services.firebase_service import db, FIREBASE_MOCK_MODE, _in_memory_scans


def get_dashboard_data():
    if FIREBASE_MOCK_MODE:
        history = _in_memory_scans
    else:
        docs = db.collection("history").stream()
        history = [doc.to_dict() for doc in docs]

    total_scans = len(history)

    recyclable = sum(1 for h in history if h.get("recyclable"))

    hazardous = sum(
        1
        for h in history
        if str(h.get("hazard", "")).lower() not in ["none", "low", "non-toxic"]
    )

    recycle_rate = (
        round((recyclable / total_scans) * 100, 2)
        if total_scans
        else 0
    )

    category_counter = Counter()

    daily_counter = Counter()

    for h in history:

        category_counter[h.get("category", "Unknown")] += 1

        ts = h.get("timestamp")

        if ts:
            day = ts.strftime("%d-%b")
            daily_counter[day] += 1

    return {

        "totalScans": total_scans,

        "recyclable": recyclable,

        "hazardous": hazardous,

        "recycleRate": recycle_rate,

        "categories": dict(category_counter),

        "dailyScans": dict(daily_counter)

    }