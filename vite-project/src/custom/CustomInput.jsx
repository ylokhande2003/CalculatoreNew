import React from 'react';
import './custome.css';

const CustomInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      className="custom-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomInput;
