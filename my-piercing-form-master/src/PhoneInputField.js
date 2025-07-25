// components/PhoneInputField.js
import React, { forwardRef } from "react";

const CustomPhoneInput = forwardRef(({ value, onChange, onBlur, name, placeholder }, ref) => (
  <input
    ref={ref}
    type="tel"
    name={name}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    placeholder={placeholder}
    className="w-full text-lg px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-[44px]"
  />
));

export default CustomPhoneInput;
