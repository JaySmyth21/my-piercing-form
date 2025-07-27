import React from 'react';
import { Field } from 'formik';

const CheckboxField = ({ name, label, required }) => (
  <div className="flex flex-col items-center mt-10">
    <div className="flex items-center w-full sm:w-3/4">
      <Field name={name}>
        {({ field }) => (
          <input
            type="checkbox"
            id={name}
            name={name} // ✅ Explicitly set name for scroll targeting
            {...field}
            checked={!!field.value}
            className="mr-2"
          />
        )}
      </Field>
      <label htmlFor={name} className="text-left text-sm sm:text-base">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
    </div>
  </div>
);

export default CheckboxField;