import React from 'react';

const CalculatorDisplay = ({ display, setDisplay }) => (
  <div className="display">
    <input type="text" value={display} readOnly />
  </div>
);

export default CalculatorDisplay;
