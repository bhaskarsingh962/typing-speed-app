import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext();


 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const checkUserLoggedIn = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setUser(response.data);
      } catch (error) {
        setUser(null); 
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

 
  const login = (userData) => {
    setUser(userData);
  };


  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
 
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };