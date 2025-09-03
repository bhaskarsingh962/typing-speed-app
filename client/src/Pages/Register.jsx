import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../Components/Input.jsx';
import Button from '../Components/Button.jsx'; // Import the Button component from '../Components/Button.jsx'; import Button from '../Components/Button.jsx';'
const Register = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      setSuccess("Registration successful! Please check your email to verify your account.");
      // Optional: Redirect to a verification page or login page after a delay
      setTimeout(() => navigate('/verify'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
  <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
    <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
      Create an Account
    </h1>
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
            label="Name"
            type="name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
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
          <Button
          children='Registration'
          type='Button'
          onClick={onSubmit}
          />
    </form>
    {error && (
      <p className="mt-4 text-center text-red-400">{error}</p>
    )}
    {success && (
      <p className="mt-4 text-center text-green-400">{success}</p>
    )}
  </div>
</div>
  )
}

export default Register;