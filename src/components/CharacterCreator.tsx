import { useState } from "react";
import { Wand2, PenTool } from "lucide-react";
import Dialog from "./Dialog";

const races = ["Human", "Elf", "Dwarf", "Orc", "Cyborg", "Android", "Alien"];
const roles = ["Hero", "Villain", "Sidekick", "Mentor", "Anti-hero", "Supporting", "Warrior"];
const traitsList = [
  "Brave", "Cunning", "Loyal", "Mysterious", "Charismatic", "Intelligent",
  "Strong", "Agile", "Wise", "Foolish", "Honorable", "Treacherous"
];

export default function CharacterCreator() {
  const [characterName, setCharacterName] = useState("");
  const [race, setRace] = useState(races[0]);
  const [role, setRole] = useState(roles[0]);
  const [traits, setTraits] = useState<string[]>([]);
  const [customTraits, setCustomTraits] = useState("");
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState("");
  const [generatedBackstory, setGeneratedBackstory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTraitChange = (trait: string) => {
    setTraits((prevTraits) =>
      prevTraits.includes(trait)
        ? prevTraits.filter((t) => t !== trait)
        : [...prevTraits, trait]
    );
  };

  const handleGenerateWithCustomTraits = () => {
    const allTraits = [...traits];
    if (customTraits.trim()) {
      allTraits.push(...customTraits.split(',').map(t => t.trim()));
    }
    setTraits(allTraits);
    setIsDialogOpen(false);
  };

  const generateBackstory = async () => {
    if (!characterName || !race || !role || traits.length === 0 || !strengthsWeaknesses) {
      alert("Please fill in all fields before generating the backstory.");
      return;
    }

    setLoading(true);
    setGeneratedBackstory("");

    const requestData = {
      characterName,
      race,
      role,
      traits,
      strengthsWeaknesses
    };

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

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
        Interactive Character Backstory Creator
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          {/* Character Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter character name..."
            />
          </div>

          {/* Race Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Race/Species
            </label>
            <select
              value={race}
              onChange={(e) => setRace(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {races.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Role in Story
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Personality Traits Section */}
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-0">
            Personality Traits
          </label>

          {/* Traits Container - Dynamically Adjust Height */}
          <div className={`bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col justify-between transition-all duration-300`}
              style={{ height: Math.max(130, Math.ceil((traits.length + 8) / 3) * 40) + "px" }}>
            
            {/* Traits List (Fills Empty Space, Including Custom Traits) */}
            <div className="grid grid-cols-3 gap-2">
              {[...new Set([...traitsList.slice(0, 6), ...traits])].map((trait) => (
                <label key={trait} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={traits.includes(trait)}
                    onChange={() => handleTraitChange(trait)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-sm dark:text-gray-200">{trait}</span>
                </label>
              ))}
            </div>

            {/* Button Positioned at Bottom Right */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              >
                <PenTool className="w-4 h-4 mr-1" />
                Modify Traits
              </button>
            </div>
          </div>




          {/* Strengths & Weaknesses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Character Strengths & Weaknesses
            </label>
            <textarea
              value={strengthsWeaknesses}
              onChange={(e) => setStrengthsWeaknesses(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32"
              placeholder="Describe the character's strengths and weaknesses..."
            />
          </div>

          {/* Generate Button */}
          <div>
            <button
              onClick={generateBackstory}
              className="w-full flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
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
          </div>
        </div>
      </div>

      {/* Generated Backstory Output */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Generated Backstory</h2>
        <textarea
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-64"
          value={generatedBackstory}
          readOnly
        />
      </div>

      {/* Traits Modification Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Modify Character Traits"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Current Traits
            </label>
            <div className="grid grid-cols-2 gap-2">
              {traitsList.map((trait) => (
                <label
                  key={trait}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={traits.includes(trait)}
                    onChange={() => handleTraitChange(trait)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-sm dark:text-gray-200">{trait}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Add Custom Traits
            </label>
            <textarea
              value={customTraits}
              onChange={(e) => setCustomTraits(e.target.value)}
              placeholder="Enter custom traits separated by commas..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24"
            />
          </div>

          <button
            onClick={handleGenerateWithCustomTraits}
            className="w-full flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            OK
          </button>
        </div>
      </Dialog>
    </div>
  );
}