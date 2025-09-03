import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../Context/AuthContext.jsx';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ rank: 'N/A', bestScore: 'N/A' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch the user's test history and their rank at the same time for efficiency
        const [historyRes, rankRes] = await Promise.all([
          axios.get('/api/results/my-result'),
          axios.get('/api/results/rank')
        ]);
        
        // This ensures history is always an array, preventing the 'length' error
        setHistory(historyRes.data.data || []); 
        setStats(rankRes.data);

      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        setHistory([]); 
        console.error("Profile data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]); 

  if (loading) {
    return <p className="text-center text-gray-400 mt-8">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400 mt-8">{error}</p>;
  }

  if (!user) {
    return <p className="text-center text-gray-400 mt-8">Please log in to view your profile.</p>;
  }

  return (
    <div className="container mx-auto p-4 text-gray-200">
      {/* Profile Header */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6 text-center">
        <h1 className="text-3xl font-bold text-yellow-400">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>

      {/* Stats and Actions Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm uppercase">Overall Rank</p>
          <p className="text-3xl font-bold">{stats.rank}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-sm uppercase">Personal Best</p>
          <p className="text-3xl font-bold">{stats.bestScore} <span className="text-xl">WPM</span></p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center flex items-center justify-center">
          <Link to="/add-text" className="w-full py-3 font-bold text-gray-900 bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors">
            Add a New Text
          </Link>
        </div>
      </div>

      {/* Test History Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Test History</h2>
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Text</th>
                <th className="py-3 px-6 text-center">WPM</th>
                <th className="py-3 px-6 text-center">Accuracy</th>
                <th className="py-3 px-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {history.length > 0 ? (
                history.map(result => (
                  <tr key={result._id} className="hover:bg-gray-700">
                    <td className="py-3 px-6 font-medium">{result.text.name}</td>
                    <td className="py-3 px-6 text-center text-yellow-400 font-semibold">{result.wpm}</td>
                    <td className="py-3 px-6 text-center">{result.accuracy.toFixed(1)}%</td>
                    <td className="py-3 px-6 text-right text-gray-400">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">You haven't completed any tests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;