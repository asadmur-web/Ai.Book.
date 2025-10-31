
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled = false, children, className = '', icon }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-semibold text-white
        bg-gradient-to-r from-purple-600 to-blue-500
        hover:from-purple-700 hover:to-blue-600
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500
        transition-all duration-300 ease-in-out transform hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
        flex items-center justify-center space-x-2
        ${className}
      `}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;
