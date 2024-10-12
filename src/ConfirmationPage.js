import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData || {};

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md max-w-xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Confirmation</h2>
        <p className="text-lg mb-4">Thank you for submitting your form. Here is a summary of your selections:</p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Selected Piercer:</h3>
            <p>{formData.piercer}</p>
          </div>
          <div>
            <h3 className="font-semibold">Selected Services:</h3>
            <ul>
              {formData.services?.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          {formData.selectedPiercing && (
            <div>
              <h3 className="font-semibold">Selected Piercing for Jewelry Changes:</h3>
              <p>{formData.selectedPiercing}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => navigate('/new-form')}  // Replace with desired route
          >
            Submit Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
