import os
import json
import re
from groq import Groq

# Fallback mode flag
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MOCK_MODE = not GROQ_API_KEY

client = None
if not MOCK_MODE:
    try:
        client = Groq(api_key=GROQ_API_KEY)
        print("Groq Client initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}. Switching to Mock Mode.")
        MOCK_MODE = True
else:
    print("GROQ_API_KEY not found. Groq service running in Mock Mode.")


def analyze_waste(item):
    global MOCK_MODE
    if MOCK_MODE:
        item_lower = item.lower()
        if any(w in item_lower for w in ["plastic", "bottle", "cup", "container", "jug"]):
            category = "Plastic"
            recyclable = True
            hazard = "None"
            disposalSteps = [
                "Rinse out any liquid or food residue to avoid contamination",
                "Crush the bottle or container to save space in the bin",
                "Place in the designated plastic recycling bin"
            ]
            recyclingInstructions = [
                "Verify the resin identification code (usually #1 or #2 is widely accepted)",
                "Keep plastic caps screwed on or discard according to municipal guidelines"
            ]
            ecoSuggestion = "Switch to a reusable glass, stainless steel flask, or container to reduce single-use plastic waste."
        elif any(w in item_lower for w in ["paper", "cardboard", "box", "book", "newspaper"]):
            category = "Paper / Cardboard"
            recyclable = True
            hazard = "None"
            disposalSteps = [
                "Flatten any boxes to optimize bin capacity",
                "Ensure the paper is dry and free of greasy residues",
                "Place in the paper recycling container"
            ]
            recyclingInstructions = [
                "Do not recycle greasy paper (e.g., pizza boxes) as it spoils the pulp batch",
                "Remove plastic liners, packing tape, or staples if possible"
            ]
            ecoSuggestion = "Choose digital alternatives where possible and opt for recycled paper products."
        elif any(w in item_lower for w in ["apple", "banana", "food", "organic", "vegetable", "fruit", "bread", "peel", "compost"]):
            category = "Organic / Food Waste"
            recyclable = False
            hazard = "None"
            disposalSteps = [
                "Collect waste in a separate kitchen compost caddy",
                "Transfer to an outdoor compost pile or local organic green bin",
                "Avoid putting meat, bones, or dairy products in home compost piles to deter pests"
            ]
            recyclingInstructions = [
                "Not suitable for standard recycling",
                "Composting converts organic matter into nutrient-rich soil helper"
            ]
            ecoSuggestion = "Plan meals ahead to reduce food waste, and use leftovers creatively."
        elif any(w in item_lower for w in ["battery", "phone", "electronics", "bulb", "charger", "e-waste"]):
            category = "Hazardous / E-Waste"
            recyclable = True
            hazard = "High (Contains heavy metals like Lead, Cadmium, and Mercury which pollute ground soil)"
            disposalSteps = [
                "Never throw electronics or batteries in the regular trash bin",
                "Apply electrical tape over battery terminals to prevent short-circuiting during transit",
                "Drop off at a certified local e-waste recycler or retail collection bin"
            ]
            recyclingInstructions = [
                "Must be processed at specialized pyrometallurgical facilities",
                "Do not attempt to open or dismantle electronics or batteries manually"
            ]
            ecoSuggestion = "Invest in rechargeable batteries and repair electronics before replacing them."
        elif any(w in item_lower for w in ["glass", "jar", "tumbler"]):
            category = "Glass"
            recyclable = True
            hazard = "Medium (Physical hazard if broken)"
            disposalSteps = [
                "Rinse thoroughly to remove food debris",
                "Keep metal lids separate as they can be recycled with metals",
                "Place in the glass container recycling bin"
            ]
            recyclingInstructions = [
                "Only recycle container glass; window panes, ceramics, and drinking glasses melt at different temperatures",
                "Clear, brown, and green glass should be sorted if requested locally"
            ]
            ecoSuggestion = "Wash and reuse glass jars for kitchen storage or dry goods."
        else:
            category = "General Waste"
            recyclable = False
            hazard = "Low"
            disposalSteps = [
                "Bag the waste securely to prevent littering",
                "Place in the general landfill trash container",
                "Dispose of according to local municipal garbage collection rules"
            ]
            recyclingInstructions = [
                "Not recyclable in regular household streams",
                "Destined for landfill or incineration"
            ]
            ecoSuggestion = "Try to avoid products packaged in non-recyclable multi-layered materials."

        return {
            "item": item,
            "category": category,
            "recyclable": recyclable,
            "hazard": hazard,
            "disposalSteps": disposalSteps,
            "recyclingInstructions": recyclingInstructions,
            "ecoSuggestion": ecoSuggestion
        }

    # Live Groq API
    prompt = f"""
You are a waste management and recycling expert.
Analyze the waste item: "{item}"

Return ONLY a valid JSON object.
The JSON must follow this schema exactly:
{{
    "item": "{item}",
    "category": "Waste Category (e.g., Plastic, Paper / Cardboard, Glass, Metal, Organic, Hazardous / E-Waste, General)",
    "recyclable": true/false,
    "hazard": "Details of any hazard warnings or 'None' if safe",
    "disposalSteps": [
        "Step 1",
        "Step 2",
        "Step 3"
    ],
    "recyclingInstructions": [
        "Instruction 1",
        "Instruction 2"
    ],
    "ecoSuggestion": "Eco-friendly alternative or reduction advice"
}}

Do not write markdown block symbols or any text other than the JSON object.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are a waste management expert. Always respond with raw JSON matching the requested schema. Do not enclose in markdown."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1
        )

        content = response.choices[0].message.content.strip()
        
        # Clean markdown wrappers if any
        content = re.sub(r"^```json\s*", "", content)
        content = re.sub(r"^```\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
        
        start = content.find("{")
        end = content.rfind("}")
        if start != -1 and end != -1:
            content = content[start:end + 1]
            
        return json.loads(content)
        
    except Exception as e:
        print(f"Error calling Groq API: {e}. Falling back to rule-based mock analysis.")
        # Fallback to local analysis on error
        MOCK_MODE = True
        return analyze_waste(item)