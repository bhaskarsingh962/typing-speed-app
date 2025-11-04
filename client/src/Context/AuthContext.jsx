import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext();


 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios to include Authorization header for all requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

   const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/users/profile');
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        // Remove invalid token
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

 
  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setUser(userData);
  };


  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
      localStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local storage and user state even if API call fails
      localStorage.removeItem("token");
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };
  
 
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };