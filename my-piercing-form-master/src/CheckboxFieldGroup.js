import React from 'react';
import { Field, useFormikContext } from 'formik';

const CheckboxGroupField = ({ name, label, options, required }) => {
  const { values } = useFormikContext();
  const currentValues = values[name] || [];

  return (
    <div className="flex flex-col items-center mt-10">
      <label className="block mb-2 text-left w-full sm:w-3/4">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-3/4">
        {options.map((option) => (
          <label key={option} className="flex items-center">
            <Field name={name}>
              {({ field }) => (
                <input
                  type="checkbox"
                  value={option}
                  checked={currentValues.includes(option)}
                  onChange={(e) => {
                    const set = new Set(currentValues);
                    if (e.target.checked) {
                      set.add(option);
                    } else {
                      set.delete(option);
                    }
                    field.onChange({
                      target: {
                        name,
                        value: Array.from(set),
                      },
                    });
                  }}
                  className="mr-2"
                />
              )}
            </Field>
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroupField;