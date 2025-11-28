import React from 'react';

export const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`w-full px-6 py-3.5 bg-[#c1765b] text-white rounded-lg hover:bg-[#8b5a3c] transition-colors font-semibold text-base ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
