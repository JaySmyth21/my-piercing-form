import React from 'react';
import { Field } from 'formik';

const FormField = ({ name, label, required, type = 'text' }) => (
  <div className="flex flex-col items-center">
    <label className="block mb-2 text-left w-full sm:w-3/4">
      {label}{required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <Field
      type={type}
      name={name}
      className="border border-gray-300 p-2 rounded w-full sm:w-3/4"
    />
    

  </div>
);

export default FormField;