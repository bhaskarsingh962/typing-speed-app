import { useState } from 'react';
import axios from 'axios';
import Button from '../Components/Button.jsx';
import Input from '../Components/Input.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/users/forget', { email });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Forgot Password
        </h1>
        <p className="text-center text-gray-400 mb-6">Enter your email address, and we'll send you a token to reset your password.</p>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Send Reset Token</Button>
        </form>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        {success && <p className="mt-4 text-center text-green-400">{success}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;