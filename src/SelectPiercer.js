// src/components/SelectPiercer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SelectPiercer = () => {
  const [selectedPiercer, setSelectedPiercer] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedPiercer) {
      navigate('/service-selection', { state: { piercer: selectedPiercer } });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Select Your Piercer</h2>
        <div className="flex flex-col space-y-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="piercer"
              value="Sairuh"
              onChange={() => setSelectedPiercer('Other')}
              className="mr-2"
            />
            Sairuh
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="piercer"
              value="Jennica"
              onChange={() => setSelectedPiercer('Jennica')}
              className="mr-2"
            />
            Jennica
          </label>
        </div>

        <div className="flex justify-between mt-6">
          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPiercer;
