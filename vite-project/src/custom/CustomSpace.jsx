// CustomSpace.js

import React from 'react';
import './custome.css';

const CustomSpace = ({ children, direction = 'horizontal', size = 'small', className = '', ...props }) => {
  return (
    <div className={`custom-space custom-space-${direction} custom-space-${size} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default CustomSpace;
