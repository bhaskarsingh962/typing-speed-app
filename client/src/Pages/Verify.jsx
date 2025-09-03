import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Verify = () => {
    const [formData, setFormData] = useState({
     email: '',
     otp: '',
  });
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const { email, otp } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await axios.post('/api/users/verify-email', {
        email,
        otp
      });
      setSuccess("Verification successful....");
      // Optional: Redirect to a verification page or login page after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during verification.');
    }
  };

  return (
   <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
  <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
    <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
      Create an Account
    </h1>
    <form onSubmit={onSubmit} className="space-y-6">
    
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-400"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={onChange}
          required
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
      <div>
  <label
    htmlFor="otp"
    className="block mb-2 text-sm font-medium text-gray-400"
  >
    OTP
 </label>
  <div className="relative">
    <input
      type={showOtp ? 'text' : 'text'}
      name="otp"
      id="otp"
      value={otp}
      onChange={onChange}
      required
      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!otp)}
      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
    >
      {otp ? 'Hide' : 'Show'}
    </button>
  </div>
</div>
      <button
        type="submit"
        className="w-full py-3 font-bold text-gray-900 bg-yellow-400 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 transition-colors"
      >
        Verify
      </button>
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

export default Verify