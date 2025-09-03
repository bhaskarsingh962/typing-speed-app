import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-yellow-400">
          TypingTest
        </Link>
        
        {!loading && (
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="hover:text-yellow-400">Home</Link>
                <Link to="/texts" className="hover:text-yellow-400">Practice</Link>
                <Link to="/leaderboard" className="hover:text-yellow-400">Leaderboard</Link>
                <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
                <button onClick={handleLogout} className="bg-yellow-400 text-gray-900 px-3 py-1 rounded hover:bg-yellow-500 font-semibold">
                  Logout
                </button>
              </>
            ) : (
              // --- Links for guests ---
              <>
                <Link to="/login" className="hover:text-yellow-400">Login</Link>
                <Link to="/register" className="bg-yellow-400 text-gray-900 px-3 py-1 rounded hover:bg-yellow-500 font-semibold">
                  Register
                </Link>
                 <Link to="/leaderboard" className="hover:text-yellow-400">Leaderboard</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;