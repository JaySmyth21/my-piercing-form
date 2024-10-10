import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ServiceSelection from './ServiceSelection';
import ClientInformation from './ClientInformation';
import SelectPiercer from './SelectPiercer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/select-piercer" replace />} />
      <Route path="/select-piercer" element={<SelectPiercer />} />
      <Route path="/service-selection" element={<ServiceSelection />} />
      <Route path="/client-info" element={<ClientInformation />} />
      {/* Add other routes as necessary */}
    </Routes>
  );
}

export default App;
