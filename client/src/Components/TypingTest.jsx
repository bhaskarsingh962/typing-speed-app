import { useRef, useEffect } from 'react';
import Button2 from './Button2.jsx';

// 1. Add 'isTestActive' back to the props
const TypingTest = ({ sourceText, userInput, timer, isTestActive, results, onInputChange, onReset, onEndTest }) => {
    const inputRef = useRef(null);
    const textDisplayRef = useRef(null);

    useEffect(() => {
        if (!results && inputRef.current) {
            inputRef.current.focus();
        }
    }, [sourceText, results]);

    useEffect(() => {
        if (textDisplayRef.current) {
            const activeChar = textDisplayRef.current.querySelector('.active-char');
            if (activeChar) {
                const containerWidth = textDisplayRef.current.offsetWidth;
                // 2. Fixed the scroll calculation to be '/ 2' for proper centering
                const scrollOffset = activeChar.offsetLeft - containerWidth / 2 + activeChar.offsetWidth / 2;
                textDisplayRef.current.scrollLeft = scrollOffset;
            }
        }
    }, [userInput]);

    const getCharClass = (char, index) => {
        let classes = '';
        if (index < userInput.length) {
            classes = char === userInput[index] ? 'text-green-400' : 'text-red-500 bg-red-900/50 rounded';
        } else if (index === userInput.length) {
            classes = 'underline decoration-yellow-400 active-char'; 
        } else {
            classes = 'text-gray-500';
        }
        return classes;
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-4xl">
            {/* Stats Display */}
            <div className="flex justify-around mb-6 text-2xl font-mono">
                <div>Time: <span className="text-yellow-400">{timer}s</span></div>
                <div>WPM: <span className="text-yellow-400">{results ? results.wpm : 0}</span></div>
                <div>Accuracy: <span className="text-yellow-400">{results ? results.accuracy.toFixed(1) : 100}%</span></div>
            </div>
            
            <div
                ref={textDisplayRef}
                className="bg-gray-900 p-6 rounded-lg text-2xl tracking-wider font-mono select-none mb-6 cursor-text overflow-hidden whitespace-nowrap"
                onClick={() => inputRef.current.focus()}
            >
                {sourceText && sourceText.split('').map((char, index) => (
                    <span key={index} className={getCharClass(char, index)}>{char}</span>
                ))}
            </div>

            <textarea
                ref={inputRef}
                value={userInput}
                onChange={onInputChange}
                disabled={results !== null}
                className="w-full h-1 p-0 bg-transparent border-0 focus:ring-4 focus:outline-none resize-none opacity-0"
                autoFocus
            />
            
            <div className="text-center space-x-4">
                {/* 3. Add conditional rendering for the 'End Test' button */}
                {isTestActive && (
                    <Button2 onClick={onEndTest}>End Test</Button2> 
                )}
                <Button2 onClick={onReset}>New Test</Button2>
            </div>
        </div>
    );
};

export default TypingTest;