import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import  Button2 from '../Components/Button2.jsx';

const AddText = () => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    difficulty: 'medium', // Default difficulty
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, content, difficulty } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
        setError("You must be logged in to add a text.");
        return;
    }

    try {
      await axios.post('/api/texts/add', { name, content, difficulty });
      setSuccess("Text submitted successfully! It is now available for others to practice.");
      setTimeout(() => navigate('/texts'), 2000); // Redirect to a library page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the text.');
    }
  };

  return (
    <div className="container mx-auto p-4 text-gray-200">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Add a New Text Passage
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-400">Title / Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={onChange}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-400">Content</label>
            <textarea
              name="content"
              id="content"
              value={content}
              onChange={onChange}
              required
              rows="6"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Paste or type the text passage here..."
            />
          </div>
          <div>
            <label htmlFor="difficulty" className="block mb-2 text-sm font-medium text-gray-400">Difficulty</label>
            <select
              name="difficulty"
              id="difficulty"
              value={difficulty}
              onChange={onChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <Button2 type='submit' children={'Submit'} onClick={onSubmit}/>
        </form>
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        {success && <p className="mt-4 text-center text-green-400">{success}</p>}
      </div>
    </div>
  );
};

export default AddText;