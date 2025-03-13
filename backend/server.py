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
    return f"""
    Generate a simple and engaging {tone.lower()} story in easy-to-understand English. 
    Always begin with 'Title: [Story Title]' on first line.
    Main elements to include:
    - Core idea: {prompt}
    - Existing lore: {lore}
    Story requirements:
    1. Maximum {length} words
    2. Clear beginning-middle-end structure
    3. 2-3 memorable characters
    4. Simple vocabulary (A2/B1 English level)
    5. Include at least one plot twist
    Write in third-person perspective. Avoid complex metaphors.
    """

### 🔹 Function to create Backstory prompt
def generate_backstory_prompt(character_name, race, role, traits, strengths_weaknesses):
    return f"""
    Write a character backstory (no title) in simple English with these rules:
    Character Details:
    - Name: {character_name}
    - Race: {race}
    - Role: {role}
    - Key traits: {traits}
    - Strengths/Weaknesses: {strengths_weaknesses}
    
    Requirements:
    1. Maximum 500 words
    2. No title
    3. Focus on personal history and motivations
    4. Include 1 formative childhood event
    5. Mention 1 important relationship
    6. Explain how they acquired their skills
    7. Use simple sentences (max 15 words each)
    8. Avoid fantasy jargon
    Write in third-person perspective.
    """

### 🔹 Function to create Lore prompt
def generate_lore_prompt(content_type, lore_name, era, themes, tone):
    return f"""
    Create detailed lore content without a title using these elements:
    - World name: {lore_name}
    - Content type: {content_type}
    - Era: {era}
    - Themes: {themes}
    - Tone: {tone}
    
    Requirements:
    1. No title
    2. Use simple terminology
    3. Focus on daily life aspects
    4. Explain cultural traditions
    5. Describe unique geography
    6. Mention common occupations
    7. Keep paragraphs short (max 4 sentences)
    8. Avoid proper nouns unless specified
    9. Write in clear, conversational English
    Include both physical and social aspects of the world.
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
