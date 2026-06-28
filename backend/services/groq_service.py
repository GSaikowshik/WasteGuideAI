import json
import re

from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def analyze_waste(item):

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