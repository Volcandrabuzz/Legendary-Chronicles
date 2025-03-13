import { useState } from "react";
import { Wand2, Save } from "lucide-react";

const tones = ["Dark", "Lighthearted", "Sci-fi", "Fantasy", "Mystery", "Romance", "Epic"];

export default function StorylineGenerator() {
  const [storyPrompt, setStoryPrompt] = useState<string>("");
  const [existingLore, setExistingLore] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>(tones[0]);
  const [storyLength, setStoryLength] = useState<number>(500);
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

    try {
      const response = await fetch("https://legendary-chronicles-1.onrender.com/generate_storyline", {
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
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">
        Dynamic Storyline Generator
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="space-y-6">
          {/* Story Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Story Prompt
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe the main plot or theme..."
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
            />
          </div>

          {/* Existing Lore */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Existing Lore (Optional)
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32"
              placeholder="Paste any existing lore or background information..."
              value={existingLore}
              onChange={(e) => setExistingLore(e.target.value)}
            />
          </div>

          {/* Tone & Story Length */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Tone & Style
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Story Length: {storyLength} words
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={storyLength}
                onChange={(e) => setStoryLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              onClick={handleGenerateStory}
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
                  Generate Story
                </>
              )}
            </button>
            <button
              className="flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
              onClick={handleSaveStory}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Story
            </button>
          </div>
        </div>
      </div>

      {/* Generated Story Display */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Generated Story</h2>
        <textarea
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-64"
          placeholder="Your generated story will appear here..."
          value={generatedStory}
          readOnly
        />
      </div>
    </div>
  );
}