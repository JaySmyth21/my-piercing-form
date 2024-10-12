import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceSelection from './ServiceSelection';
import ClientInfo from './ClientInfo';
import Confirmation from './Confirmation';

const FormSubmission = () => {
  const [formData, setFormData] = useState({
    services: [],
    selectedPiercing: '',
    // Include other form data fields here as necessary
  });

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData, // Merge the new data with the existing form data
    }));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/service-selection"
          element={<ServiceSelection formData={formData} updateFormData={updateFormData} />}
        />
        <Route
          path="/client-info"
          element={<ClientInfo formData={formData} updateFormData={updateFormData} />}
        />
        <Route
          path="/confirmation"
          element={<Confirmation formData={formData} />}
        />
      </Routes>
    </Router>
  );
};

export default FormSubmission;
