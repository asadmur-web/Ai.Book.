import React from 'react';
import { Tool } from '../types';
import { BrainCircuit, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

// Header component with logo and navigation
// مكون الترويسة مع الشعار والتنقل
const Header: React.FC<HeaderProps> = ({ activeTool, setActiveTool }) => {
  const tools = Object.values(Tool);

  return (
    <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Site Name */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <BrainCircuit className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            AI Book
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center bg-gray-900/50 rounded-full p-1">
          {tools.map((tool) => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none transform hover:-translate-y-0.5 btn-glow ${
                activeTool === tool
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {tool}
            </button>
          ))}
        </nav>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-center bg-gray-900/50 p-1 space-x-1">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool)}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-all duration-300 ease-in-out focus:outline-none flex-1 text-center ${
              activeTool === tool
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {tool}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;