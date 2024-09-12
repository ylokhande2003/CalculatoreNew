import React from 'react';
import './custome.css';

const CustomButton = ({ children, onClick, className }) => {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
