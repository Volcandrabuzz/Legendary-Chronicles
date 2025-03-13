import { useState } from "react";
import { Book, Users, Scroll, Home } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import StorylineGenerator from './components/StorylineGenerator';
import CharacterCreator from './components/CharacterCreator';
import LoreGenerator from './components/LoreGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'storyline':
        return <StorylineGenerator />;
      case 'character':
        return <CharacterCreator />;
      case 'lore':
        return <LoreGenerator />;
      default:
        return (
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
              Welcome to AI Storytelling Suite
            </h1>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: 'Dynamic Storyline Generator',
                  icon: <Book className="w-12 h-12 mb-4 text-indigo-500 dark:text-indigo-400" />,
                  description: 'Create evolving narratives with AI-powered storytelling.',
                  action: () => setActiveTab('storyline')
                },
                {
                  title: 'Character Backstory Creator',
                  icon: <Users className="w-12 h-12 mb-4 text-indigo-500 dark:text-indigo-400" />,
                  description: 'Generate rich character histories and personalities.',
                  action: () => setActiveTab('character')
                },
                {
                  title: 'Lore Content Generator',
                  icon: <Scroll className="w-12 h-12 mb-4 text-indigo-500 dark:text-indigo-400" />,
                  description: 'Build comprehensive world lore and mythology.',
                  action: () => setActiveTab('lore')
                }
              ].map((tool, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={tool.action}
                >
                  <div className="flex justify-center">{tool.icon}</div>
                  <h2 className="text-xl font-semibold mb-3 dark:text-white">{tool.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center px-4 ${
                    activeTab === 'home'
                      ? 'border-b-2 border-indigo-500 dark:border-indigo-400'
                      : ''
                  } dark:text-white`}
                >
                  <Home className="w-5 h-5 mr-2" />
                  <span className="font-medium">Home</span>
                </button>
                <button
                  onClick={() => setActiveTab('storyline')}
                  className={`flex items-center px-4 ${
                    activeTab === 'storyline'
                      ? 'border-b-2 border-indigo-500 dark:border-indigo-400'
                      : ''
                  } dark:text-white`}
                >
                  <Book className="w-5 h-5 mr-2" />
                  <span className="font-medium">Storyline</span>
                </button>
                <button
                  onClick={() => setActiveTab('character')}
                  className={`flex items-center px-4 ${
                    activeTab === 'character'
                      ? 'border-b-2 border-indigo-500 dark:border-indigo-400'
                      : ''
                  } dark:text-white`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Characters</span>
                </button>
                <button
                  onClick={() => setActiveTab('lore')}
                  className={`flex items-center px-4 ${
                    activeTab === 'lore'
                      ? 'border-b-2 border-indigo-500 dark:border-indigo-400'
                      : ''
                  } dark:text-white`}
                >
                  <Scroll className="w-5 h-5 mr-2" />
                  <span className="font-medium">Lore</span>
                </button>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 px-4">{renderContent()}</main>
      </div>
    </ThemeProvider>
  );
}

export default App;