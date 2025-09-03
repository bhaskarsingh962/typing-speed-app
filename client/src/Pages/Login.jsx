import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import Link
import axios from 'axios';
import Input from '../Components/Input.jsx'
import Button from '../Components/Button.jsx';
import { AuthContext } from '../Context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (success) {
      setFormData({
        email: "",
        password: "",
      })
    }
  }, [success])

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/users/login', {
        email,
        password,
      });
      login(response.data.user);
      setSuccess("Login successful!");
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Login Page
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength={8}
          />
          <Button type="submit">
            Login
          </Button>
        </form>
        
        {/* 2. Add the "Forgot Password?" link here */}
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-yellow-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {error && (
          <p className="mt-4 text-center text-red-400">{error}</p>
        )}
        {success && (
          <p className="mt-4 text-center text-green-400">{success}</p>
        )}
      </div>
    </div>
  );
}

export default Login;