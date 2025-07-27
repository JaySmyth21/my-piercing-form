import React from 'react';
import { Field } from 'formik';

const RadioGroupField = ({ name, label, options, required }) => {
  
  return (
    <div className="flex flex-col items-center mt-10">
      <label className="block mb-2 text-left w-full sm:w-3/4">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="w-full sm:w-3/4">
        {options.map((option) => (
          <label key={option} className="flex items-center mb-2">
            <Field name={name}>
              {({ field }) => (
                <input
                  type="radio"
                  {...field}
                  value={option}
                  checked={field.value === option}
                  className="mr-2"
                />
              )}
            </Field>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroupField;