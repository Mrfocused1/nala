import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-3 border-2 border-[#c1765b]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1765b] focus:border-[#c1765b] transition-all text-base text-[#333333] placeholder:text-gray-400 ${className}`}
      {...props}
    />
  );
};
