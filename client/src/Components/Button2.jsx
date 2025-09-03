

const Button2 = ({ children, type = 'button', onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="py-3 px-6 font-bold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors mr-2"
    >
      {children}
    </button>
  );
};

export default Button2;