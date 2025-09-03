import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-400 mt-auto">
      <div className="container mx-auto py-4 px-5 text-center">
        <p>© {currentYear} TypingTest — All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer