import React from 'react';
import { Calculator } from './components/Calculator';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-light text-white text-center mb-8">
          Calculator
        </h1>
        <Calculator />
        <p className="text-gray-400 text-center text-sm mt-6">
          Basic arithmetic operations with precision handling
        </p>
      </div>
    </div>
  );
}

export default App;