import React from 'react';

const CalculatorButton = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export default CalculatorButton;
