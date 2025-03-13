import { useState } from "react";
import { Wand2, RotateCcw, Save } from "lucide-react";

const tones = ["Dark", "Lighthearted", "Sci-fi", "Fantasy", "Mystery", "Romance"];

export default function StorylineGenerator() {
  const [storyPrompt, setStoryPrompt] = useState("");
  const [existingLore, setExistingLore] = useState("");
  const [selectedTone, setSelectedTone] = useState(tones[0]);
  const [storyLength, setStoryLength] = useState(500);
  const [generatedStory, setGeneratedStory] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to clear all inputs
  const handleRegenerate = () => {
    setStoryPrompt("");
    setExistingLore("");
    setSelectedTone(tones[0]);
    setStoryLength(500);
    setGeneratedStory("");
  };

  // Function to save the story locally
  const handleSaveStory = () => {
    if (!generatedStory) {
      alert("No story generated yet!");
      return;
    }

    const blob = new Blob([generatedStory], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Generated_Story.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to generate a story (calls backend API)
  const handleGenerateStory = async () => {
    if (!storyPrompt) {
      alert("Please enter a story prompt!");
      return;
    }

    const requestData = {
      storyPrompt,
      existingLore,
      tone: selectedTone,
      storyLength,
    };

    setLoading(true); // Show loading state

    try {
      const response = await fetch("http://localhost:5000/generate_storyline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();
      setGeneratedStory(data.story || "Failed to generate story.");
    } catch (error) {
      console.error("Error generating story:", error);
      setGeneratedStory("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600">Dynamic Storyline Generator</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="space-y-6">
          {/* Story Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Prompt</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the main plot or theme..."
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
            />
          </div>

          {/* Existing Lore */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Existing Lore (Optional)</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-32"
              placeholder="Paste any existing lore or background information..."
              value={existingLore}
              onChange={(e) => setExistingLore(e.target.value)}
            />
          </div>

          {/* Tone & Story Length */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone & Style</label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Length: {storyLength} words
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={storyLength}
                onChange={(e) => setStoryLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={handleGenerateStory}
              disabled={loading}
            >
              {loading ? "Generating..." : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Story
                </>
              )}
            </button>
            <button
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:border-violet-500 hover:bg-gray-50"
              onClick={handleRegenerate}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Regenerate Section
            </button>
            <button
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:border-violet-500 hover:bg-gray-50"
              onClick={handleSaveStory}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Story
            </button>
          </div>
        </div>
      </div>

      {/* Generated Story Display */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Story</h2>
        <textarea
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 h-64"
          placeholder="Your generated story will appear here..."
          value={generatedStory}
          readOnly
        />
      </div>
    </div>
  );
}
