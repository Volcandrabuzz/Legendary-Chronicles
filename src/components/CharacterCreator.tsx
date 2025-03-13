import { useState } from "react";
import { Wand2, PenTool} from "lucide-react"; // Loader2 for animated spinner

const races = ["Human", "Elf", "Dwarf", "Orc", "Cyborg", "Android", "Alien"];
const roles = ["Hero", "Villain", "Sidekick", "Mentor", "Anti-hero", "Supporting","Warrior"];
const traitsList = [
  "Brave", "Cunning", "Loyal", "Mysterious", "Charismatic", "Intelligent",
  "Strong", "Agile", "Wise", "Foolish", "Honorable", "Treacherous"
];

export default function CharacterCreator() {
  const [characterName, setCharacterName] = useState("");
  const [race, setRace] = useState(races[0]);
  const [role, setRole] = useState(roles[0]);
  const [traits, setTraits] = useState<string[]>([]);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState("");
  const [generatedBackstory, setGeneratedBackstory] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleTraitChange = (trait: string) => {
    setTraits((prevTraits) =>
      prevTraits.includes(trait)
        ? prevTraits.filter((t) => t !== trait)
        : [...prevTraits, trait]
    );
  };

  const generateBackstory = async () => {
    if (!characterName || !race || !role || traits.length === 0 || !strengthsWeaknesses) {
      alert("Please fill in all fields before generating the backstory.");
      return;
    }

    setLoading(true); // Start loading
    setGeneratedBackstory(""); // Clear previous output

    const requestData = { characterName, race, role, traits, strengthsWeaknesses };

    try {
      const response = await fetch("https://legendary-chronicles-1.onrender.com/generate_backstory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate backstory.");
      }

      const data = await response.json();
      setGeneratedBackstory(data.backstory || "Failed to generate backstory.");
    } catch (error) {
      console.error("Error generating backstory:", error);
      setGeneratedBackstory("An error occurred. Please try again.");
    }

    setLoading(false); // Stop loading
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">
        Interactive Character Backstory Creator
      </h1>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Strengths & Weaknesses
              </label>
              <textarea
                value={strengthsWeaknesses}
                onChange={(e) => setStrengthsWeaknesses(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
                placeholder="Describe the character's strengths and weaknesses..."
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 w-full">
              {/* Generate Backstory Button with Animated Spinner */}
              <button
                onClick={generateBackstory}
                className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 018 8h-4l3.5 3.5L20 12h-4a8 8 0 01-8 8v-4l-3.5 3.5L4 12z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Backstory
                  </>
                )}
              </button>

              {/* Modify Traits Button */}
              <button className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <PenTool className="w-5 h-5 mr-2" />
                Modify Traits
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
