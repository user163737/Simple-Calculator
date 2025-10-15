import React from 'react';

interface DisplayProps {
  value: string;
  hasError?: boolean;
  expression?: string;
}

export const Display: React.FC<DisplayProps> = ({ value, hasError = false, expression = '' }) => {
  const formatDisplay = (value: string): string => {
    if (hasError || value === 'Error') {
      return 'Error';
    }

    // Handle very large numbers with scientific notation
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (Math.abs(numValue) >= 1e10 || (Math.abs(numValue) < 1e-6 && numValue !== 0)) {
        return numValue.toExponential(6);
      }
    }

    return value;
  };

  return (
    <div className="bg-black text-right p-6 rounded-2xl mb-4">
      {expression && (
        <div className="text-lg text-gray-400 mb-2 min-h-[1.5rem] leading-none">
          {expression}
        </div>
      )}
      <div 
        className={`text-5xl font-light leading-none transition-colors duration-200 ${
          hasError 
            ? 'text-red-400' 
            : 'text-white'
        }`}
      >
        {formatDisplay(value)}
      </div>
    </div>
  );
};