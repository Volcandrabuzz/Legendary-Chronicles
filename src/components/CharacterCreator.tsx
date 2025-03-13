import { useState } from "react";
import { Wand2, PenTool, Link } from "lucide-react";

const races = ["Human", "Elf", "Dwarf", "Orc", "Cyborg", "Android", "Alien"];
const roles = ["Hero", "Villain", "Sidekick", "Mentor", "Anti-hero", "Supporting"];
const traitsList = [
  "Brave", "Cunning", "Loyal", "Mysterious", "Charismatic", "Intelligent",
  "Strong", "Agile", "Wise", "Foolish", "Honorable", "Treacherous"
];

export default function CharacterCreator() {
  // State for form inputs
  const [characterName, setCharacterName] = useState("");
  const [race, setRace] = useState(races[0]);
  const [role, setRole] = useState(roles[0]);
  const [traits, setTraits] = useState<string[]>([]);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState("");
  const [generatedBackstory, setGeneratedBackstory] = useState("");

  // Handle trait selection
  const handleTraitChange = (trait: string) => {
    setTraits((prevTraits) =>
      prevTraits.includes(trait)
        ? prevTraits.filter((t) => t !== trait)
        : [...prevTraits, trait]
    );
  };
  
  

  // Function to generate backstory
  const generateBackstory = async () => {
    if (!characterName || !race || !role || traits.length === 0 || !strengthsWeaknesses) {
      alert("Please fill in all fields before generating the backstory.");
      return;
    }

    const requestData = {
      characterName,
      race,
      role,
      traits,
      strengthsWeaknesses,
    };

    try {
      const response = await fetch("http://localhost:5000/generate_backstory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setGeneratedBackstory(data.backstory || "Failed to generate backstory.");
    } catch (error) {
      console.error("Error generating backstory:", error);
      setGeneratedBackstory("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Interactive Character Backstory Creator</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            {/* Character Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Character Name</label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter character name..."
              />
            </div>

            {/* Race Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Race/Species</label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {races.map((race) => (
                  <option key={race} value={race}>
                    {race}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role in Story</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Personality Traits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personality Traits</label>
              <div className="grid grid-cols-3 gap-2">
                {traitsList.map((trait) => (
                  <label key={trait} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={traits.includes(trait)}
                      onChange={() => handleTraitChange(trait)}
                      className="rounded text-indigo-600"
                    />
                    <span className="text-sm">{trait}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Character Strengths & Weaknesses</label>
              <textarea
                value={strengthsWeaknesses}
                onChange={(e) => setStrengthsWeaknesses(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
                placeholder="Describe the character's strengths and weaknesses..."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4">
              <button
                onClick={generateBackstory}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Backstory
              </button>
              <button className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <PenTool className="w-5 h-5 mr-2" />
                Modify Traits
              </button>
              <button className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Link className="w-5 h-5 mr-2" />
                Attach to Story
              </button>
            </div>
          </div>
        </div>

        {/* Generated Backstory Output */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Backstory</h2>
          <textarea
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-64"
            value={generatedBackstory}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
