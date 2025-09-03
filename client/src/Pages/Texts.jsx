import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Texts = () => {
  const [texts, setTexts] = useState([]);
  const [difficulty, setDifficulty] = useState(""); // Empty string means 'all'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTexts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/texts/get?difficulty=${difficulty}`
        );
        // Access the array from the 'data' property of the response
        setTexts(response.data.data || []);
      } catch (err) {
        setError("Failed to load texts. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, [difficulty]); // Refetch when the difficulty changes

  return (
    <div className="container mx-auto p-4 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        Texts Library
      </h1>

      {/* Difficulty Filter Buttons */}
      <div className="flex justify-center space-x-2 mb-8">
        <button
          onClick={() => setDifficulty("")}
          className={`px-4 py-2 rounded font-semibold ${
            difficulty === ""
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setDifficulty("easy")}
          className={`px-4 py-2 rounded font-semibold ${
            difficulty === "easy"
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Easy
        </button>
        <button
          onClick={() => setDifficulty("medium")}
          className={`px-4 py-2 rounded font-semibold ${
            difficulty === "medium"
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => setDifficulty("hard")}
          className={`px-4 py-2 rounded font-semibold ${
            difficulty === "hard"
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Hard
        </button>
      </div>

      {loading && <p className="text-center">Loading texts...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {texts.map((text) => (
            <Link
              to={`/texts/${text._id}`}
              key={text._id}
              className="block bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-yellow-400 mb-2 truncate">
                {text.name}
              </h2>
              <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">
                {text.content}
              </p>
              <div className="text-right">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                    text.difficulty === "easy"
                      ? "bg-green-600 text-white"
                      : text.difficulty === "medium"
                      ? "bg-blue-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {text.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Texts;
