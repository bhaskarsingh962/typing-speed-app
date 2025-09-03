import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTyping } from '../customHooks/useTyping.js';
import TypingTest from '../Components/TypingTest.jsx';

const HomePage = () => {
  // 1. Rename your state to avoid conflicts
  const [textToType, setTextToType] = useState({ id: null, content: '' });

  // 2. Pass your state to the hook
  const { 
    sourceText, // This is the text object from inside the hook
    userInput, 
    timer, 
    results, 
    isTestActive, 
    handleInputChange, 
    resetTest, 
    endTest 
  } = useTyping(textToType);

  const fetchNewText = async () => {
    try {
      const response = await axios.get('/api/texts/random');
      setTextToType({
        id: response.data._id,
        content: response.data.content,
      });
    } catch (error) {
      console.error("Failed to fetch text:", error);
      setTextToType({ id: 'fallback', content: "Failed to load text. Please try again." });
    }
  };

  useEffect(() => {
    fetchNewText();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Typing Test</h1>
      <TypingTest 
        // 4. Pass the 'content' string from the hook's state to the UI
        sourceText={sourceText.content} 
        userInput={userInput}
        timer={timer}
        results={results}
        isTestActive={isTestActive}
        onInputChange={handleInputChange}
        onReset={fetchNewText}
        onEndTest={endTest}
      />
    </div>
  );
};

export default HomePage;