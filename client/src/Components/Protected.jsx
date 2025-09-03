import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {AuthContext} from '../Context/AuthContext.jsx';

const Protected = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protected;