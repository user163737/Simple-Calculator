import React from 'react';

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  className = '', 
  children, 
  active = false 
}) => {
  const baseClasses = `
    w-full h-16 rounded-full text-2xl font-semibold
    transition-all duration-150 ease-in-out
    active:scale-95 select-none
    flex items-center justify-center
    touch-manipulation
  `;
  
  const defaultClasses = 'bg-gray-600 hover:bg-gray-500 text-white';
  
  const finalClasses = `${baseClasses} ${className || defaultClasses} ${
    active ? 'ring-2 ring-white ring-opacity-50' : ''
  }`;

  return (
    <button
      onClick={onClick}
      className={finalClasses}
      type="button"
    >
      {children}
    </button>
  );
};