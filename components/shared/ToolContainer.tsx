
import React from 'react';

interface ToolContainerProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

// This is a wrapper component to provide consistent layout for each tool.
// هذا مكون غلاف لتوفير تخطيط متسق لكل أداة.
const ToolContainer: React.FC<ToolContainerProps> = ({ title, description, icon, children }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-purple-500/20">
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-3 rounded-xl shadow-lg">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold font-orbitron text-white">{title}</h2>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ToolContainer;
