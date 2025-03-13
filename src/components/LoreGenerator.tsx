import { useState } from "react";
import { Wand2, PenTool } from "lucide-react";

const contentTypes = ["Short Story", "Ancient Text", "Dialogues", "Mythology", "Historical Record"];
const eras = ["Medieval", "Renaissance", "Modern", "Cyberpunk", "Post-Apocalyptic", "Ancient"];
const themes = ["War", "Peace", "Love", "Betrayal", "Discovery", "Magic", "Technology", "Nature"];
const tones = ["Epic", "Comedic", "Tragic", "Mysterious", "Romantic", "Educational"];

export default function LoreGenerator() {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [loreName, setLoreName] = useState("");
  const [era, setEra] = useState(eras[0]);
  const [tone, setTone] = useState(tones[0]);
  const [generatedLore, setGeneratedLore] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  const generateLore = async () => {
    setLoading(true);

    const requestBody = {
      content_type: contentType,
      lore_name: loreName,
      era: era,
      themes: selectedThemes,
      tone: tone,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_lore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setGeneratedLore(data.lore || "Error generating lore. Please try again.");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Automated Lore Content Generator</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="space-y-6">
          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type of Content</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Lore Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lore/World Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the name of your world..."
              value={loreName}
              onChange={(e) => setLoreName(e.target.value)}
            />
          </div>

          {/* Era Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Era or Timeline</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={era}
              onChange={(e) => setEra(e.target.value)}
            >
              {eras.map((era) => (
                <option key={era} value={era}>
                  {era}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major Themes</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <label
                  key={theme}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedThemes.includes(theme) ? "bg-indigo-100 text-indigo-700" : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleTheme(theme)}
                >
                  <input type="checkbox" className="rounded text-indigo-600 mr-2" checked={selectedThemes.includes(theme)} readOnly />
                  <span className="text-sm">{theme}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone & Style</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons (Horizontally Aligned) */}
          <div className="flex space-x-4">
            {/* Generate Lore Button with Animated Spinner */}
            <button
              onClick={generateLore}
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
                  Generate Lore
                </>
              )}
            </button>

            {/* Refine Button */}
            <button className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <PenTool className="w-5 h-5 mr-2" />
              Refine
            </button>
          </div>
        </div>
      </div>

      {/* Generated Lore Display */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Lore Content</h2>
        <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-64" placeholder="Your generated lore content will appear here..." value={generatedLore} readOnly />
      </div>
    </div>
  );
}
