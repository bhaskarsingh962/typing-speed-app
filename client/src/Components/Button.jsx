import React from 'react'

const Button = ({ children, type = 'button', onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-3 font-bold text-gray-900 bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 transition-colors"
    >
      {children}
    </button>
  );
};

export default Button;