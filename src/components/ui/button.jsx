import React from 'react';

export const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
