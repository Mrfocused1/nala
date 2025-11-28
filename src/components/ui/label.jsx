import React from 'react';

export const Label = ({ children, className = '', ...props }) => {
  return (
    <label
      className={`block text-base font-semibold text-[#333333] mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
