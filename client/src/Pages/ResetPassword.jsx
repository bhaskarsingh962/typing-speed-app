import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../Components/Button.jsx';
import Input from '../Components/Input.jsx';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const { data } = await axios.put(`/api/users/reset/${token}`, { password });
      setSuccess(data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Reset Your Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="New Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <Button type="submit">Reset Password</Button>
        </form>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        {success && <p className="mt-4 text-center text-green-400">{success}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;