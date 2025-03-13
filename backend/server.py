import os
import random
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests
app.secret_key = os.urandom(24)  # Secure secret key

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Gemini API Model
MODEL_NAME = "gemini-2.0-flash"

# Tone choices
TONES = ['Dark', 'Lighthearted', 'Sci-fi', 'Fantasy', 'Mystery', 'Romance']

### 🔹 Function to call Gemini AI
def call_gemini(prompt):
    """
    Calls Gemini AI with the given prompt and returns generated content.
    """
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        return response.text if response.text else "AI failed to generate content."
    except Exception as e:
        return f"AI Error: {str(e)}"

### 🔹 Function to create Storyline prompt
def generate_storyline_prompt(prompt, lore, tone, length):
    """
    Constructs a structured storyline prompt for AI.
    """
    return f"""
    Create a compelling {tone.lower()} storyline based on the following details:
    - **Main Idea:** {prompt}
    - **Lore:** {lore}
    - **Length:** {length} words
    Make it engaging, immersive, and rich in detail.
    """

### 🔹 Function to create Backstory prompt
def generate_backstory_prompt(character_name, race, role, traits, strengths_weaknesses):
    """
    Constructs a detailed backstory prompt for AI.
    """
    return f"""
    Create a detailed backstory for the following character:
    - **Name:** {character_name}
    - **Race:** {race}
    - **Role:** {role}
    - **Traits:** {", ".join(traits)}
    - **Strengths & Weaknesses:** {strengths_weaknesses}
    Make the story engaging, immersive, and lore-rich.
    """

### 🔹 Function to create Lore prompt
def generate_lore_prompt(content_type, lore_name, era, themes, tone):
    """
    Constructs a lore-building prompt for AI.
    """
    return f"""
    Generate a {tone.lower()} {content_type.lower()} about the world named {lore_name}.
    - **Era:** {era}
    - **Themes:** {", ".join(themes)}
    Make it immersive, detailed, and rich in world-building elements.
    """

### **📌 API Routes**
@app.route("/generate_backstory", methods=["POST"])
def generate_backstory():
    """
    API endpoint to generate a character backstory.
    """
    data = request.get_json()
    character_name = data.get("characterName", "").strip()
    race = data.get("race", "").strip()
    role = data.get("role", "").strip()
    traits = data.get("traits", [])
    strengths_weaknesses = data.get("strengthsWeaknesses", "").strip()

    # Validate input fields
    if not all([character_name, race, role, traits, strengths_weaknesses]):
        return jsonify({"error": "All fields are required"}), 400

    prompt = generate_backstory_prompt(character_name, race, role, traits, strengths_weaknesses)
    backstory = call_gemini(prompt)

    return jsonify({"backstory": backstory}), 200

@app.route("/generate_storyline", methods=["POST"])
def generate_storyline():
    """
    API endpoint to generate a storyline.
    """
    data = request.json
    prompt = data.get('storyPrompt', '')
    lore = data.get('existingLore', '')
    tone = data.get('tone', 'Neutral')
    length = data.get('storyLength', 500)

    if not prompt:
        return jsonify({"error": "Story prompt is required"}), 400

    storyline_prompt = generate_storyline_prompt(prompt, lore, tone, length)
    generated_story = call_gemini(storyline_prompt)

    return jsonify({"story": generated_story}), 200

@app.route("/generate_lore", methods=["POST"])
def generate_lore():
    """
    API endpoint to generate lore/world-building content.
    """
    data = request.get_json()
    content_type = data.get("content_type")
    lore_name = data.get("lore_name", "Unnamed Lore")
    era = data.get("era")
    themes = data.get("themes", [])
    tone = data.get("tone")

    if not content_type or not era or not tone:
        return jsonify({"error": "Missing required fields"}), 400

    prompt = generate_lore_prompt(content_type, lore_name, era, themes, tone)
    lore_text = call_gemini(prompt)

    return jsonify({"lore": lore_text}), 200

### **🚀 Run Flask App**
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
