import json
import re

from groq import Groq
from config import GROQ_API_KEY

# Fallback mode flag
MOCK_MODE = not GROQ_API_KEY

if not MOCK_MODE:
    try:
        client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}. Switching to Mock Mode.")
        MOCK_MODE = True
        client = None
else:
    client = None



def analyze_waste(item):
    if MOCK_MODE:
        item_lower = item.lower()
        if any(w in item_lower for w in ["plastic", "bottle", "cup", "container"]):
            category = "Plastic"
            recyclable = True
            hazard = "None"
            disposalSteps = ["Rinse out any liquid or food residue", "Crush the bottle to save space", "Place in the recycling bin"]
            recyclingInstructions = ["Ensure it has the recycling symbol (usually #1 or #2)", "Keep caps on or off depending on local guidelines"]
            ecoSuggestion = "Switch to a reusable flask to avoid single-use plastics."
        elif any(w in item_lower for w in ["paper", "cardboard", "box", "book"]):
            category = "Paper / Cardboard"
            recyclable = True
            hazard = "None"
            disposalSteps = ["Flatten cardboard boxes", "Keep dry and free of grease", "Place in the paper recycling bin"]
            recyclingInstructions = ["Do not recycle paper contaminated with grease or food", "Remove any plastic wrap or packing tape"]
            ecoSuggestion = "Opt for digital receipts and reusable bags to reduce paper usage."
        elif any(w in item_lower for w in ["apple", "banana", "food", "organic", "vegetable", "fruit", "bread", "compost"]):
            category = "Organic / Food Waste"
            recyclable = False
            hazard = "None"
            disposalSteps = ["Collect in a compost kitchen bin", "Transfer to an outdoor compost pile or green bin", "Avoid putting meat or dairy in home compost to prevent pests"]
            recyclingInstructions = ["Composting is the organic equivalent of recycling", "Do not mix with plastics or metals"]
            ecoSuggestion = "Start home composting to turn kitchen scraps into nutrient-rich soil."
        elif any(w in item_lower for w in ["battery", "phone", "electronics", "bulb", "chemical"]):
            category = "Hazardous / E-Waste"
            recyclable = True
            hazard = "High (Heavy metals, toxic chemicals)"
            disposalSteps = ["Do not throw in regular trash bin", "Cover terminals of batteries with tape to prevent short circuit", "Drop off at a designated e-waste collection center"]
            recyclingInstructions = ["Must be processed at specialized facilities", "Do not attempt to puncture or open batteries"]
            ecoSuggestion = "Use rechargeable batteries or look for brands offering recycling take-back programs."
        else:
            category = "General Waste"
            recyclable = False
            hazard = "Low"
            disposalSteps = ["Place in general trash bin", "Ensure it is bagged securely", "Dispose of according to local landfill guidelines"]
            recyclingInstructions = ["Check if local specialized recycling exists", "Usually landfilled or incinerated"]
            ecoSuggestion = "Try to avoid products that cannot be recycled or composted."

        return {
            "item": item,
            "category": category,
            "recyclable": recyclable,
            "hazard": hazard,
            "disposalSteps": disposalSteps,
            "recyclingInstructions": recyclingInstructions,
            "ecoSuggestion": ecoSuggestion
        }

    prompt = f"""
You are an expert waste management assistant.

Analyze the waste item: "{item}"

Return ONLY a valid JSON object.

The JSON must exactly follow this schema:

{{
    "item": "",
    "category": "",
    "recyclable": true,
    "hazard": "",
    "disposalSteps": [
        "",
        "",
        ""
    ],
    "recyclingInstructions": [
        "",
        ""
    ],
    "ecoSuggestion": ""
}}

Do not include markdown.
Do not include explanations.
Return only JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a waste management expert. Always respond with valid JSON only."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content.strip()

    print("\n========== RAW GROQ RESPONSE ==========")
    print(content)
    print("=======================================\n")

    # Remove markdown fences if present
    content = re.sub(r"^```json\s*", "", content)
    content = re.sub(r"^```\s*", "", content)
    content = re.sub(r"\s*```$", "", content)

    # Extract JSON object
    start = content.find("{")
    end = content.rfind("}")

    if start == -1 or end == -1:
        raise Exception(f"Groq did not return JSON:\n\n{content}")

    json_text = content[start:end + 1]

    return json.loads(json_text)