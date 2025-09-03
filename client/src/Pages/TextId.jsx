import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTyping } from '../customHooks/useTyping.js';
import TypingTest from '../Components/TypingTest.jsx';

const TextId = () => {
    const { id } = useParams();
    // 1. Store the full text object in state, not just the string
    const [textData, setTextData] = useState({ id: null, name: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Pass the full textData object to the hook
    const { sourceText, userInput, timer, isTestActive, results, handleInputChange, resetTest, endTest } = useTyping(textData, true);

    useEffect(() => {
        const fetchText = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/texts/get/${id}`);
                // 3. Set the full object in state
                setTextData({
                    id: response.data._id,
                    name: response.data.name,
                    content: response.data.content,
                });
            } catch (error) {
                setError('Failed to load text.');
            } finally {
                setLoading(false);
            }
        };
        fetchText();
    }, [id]);

    if (loading) return <p className="text-center text-gray-400">Loading...</p>;
    if (error) return <p className="text-center text-red-400">{error}</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">{textData.name}</h1>
            <TypingTest
                // 4. Pass ONLY the content string to the UI component
                sourceText={sourceText.content}
                userInput={userInput}
                timer={timer}
                isTestActive={isTestActive} // Pass this down
                results={results}
                onInputChange={handleInputChange}
                onReset={resetTest}
                onEndTest={endTest}
            />
        </div>
    );
};

export default TextId;