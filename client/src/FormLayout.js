import React from 'react';

const FormLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-5/6 bg-white p-8 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
