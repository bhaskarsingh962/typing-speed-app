import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaderBoard = () => {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/results/leaderboard?difficulty=${difficulty}`);
        
        // 3. Access the array from the 'data' property
        setLeaderBoard(response.data.data || []); 

      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Could not load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderBoard();
  }, [difficulty]);

  const renderLeaderboard = () => {
    if (loading) {
      return <div className="text-center py-8 text-gray-500">Loading leaderboard...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (leaderBoard.length === 0) {
      return <div className="text-center py-8 text-gray-500">No results found for this difficulty.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Rank</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Username</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">WPM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderBoard.map((itr, index) => (
              <tr
                key={itr._id}
                className={`transition-colors duration-200 ease-in-out hover:bg-gray-50 ${index === 0 ? 'bg-yellow-100' : ''} ${index === 1 ? 'bg-gray-200' : ''} ${index === 2 ? 'bg-orange-100' : ''}`}
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${index === 0 ? "bg-yellow-500" : ""} ${index === 1 ? "bg-gray-500" : ""} ${index === 2 ? "bg-orange-500" : ""} ${index > 2 ? "bg-blue-500" : ""}`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 font-medium text-gray-800">{itr.user.name}</td>
                <td className="py-4 px-6 text-lg font-bold text-gray-900">{itr.wpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-10">
      <div className="flex justify-center space-x-2 mb-8">
        <button onClick={() => setDifficulty('')} className={`px-4 py-2 rounded font-semibold transition-colors ${difficulty === '' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>All</button>
        <button onClick={() => setDifficulty('easy')} className={`px-4 py-2 rounded font-semibold transition-colors ${difficulty === 'easy' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>Easy</button>
        <button onClick={() => setDifficulty('medium')} className={`px-4 py-2 rounded font-semibold transition-colors ${difficulty === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>Medium</button>
        <button onClick={() => setDifficulty('hard')} className={`px-4 py-2 rounded font-semibold transition-colors ${difficulty === 'hard' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}>Hard</button>
      </div>
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        🏆 Leaderboard 🏆
      </h1>
      {renderLeaderboard()}
    </div>
  );
};

export {LeaderBoard};