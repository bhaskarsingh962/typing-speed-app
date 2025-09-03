import { useState, useEffect, useCallback, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

export const useTyping = (
  initialTextObj = { id: null, content: "" },
  enableSave = false
) => {
  const { user } = useContext(AuthContext);
  const [sourceText, setSourceText] = useState(initialTextObj);
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [results, setResults] = useState(null);

  const stateRef = useRef({ userInput, sourceText, timer, user, enableSave });
  stateRef.current = { userInput, sourceText, timer, user, enableSave };

  const endTest = useCallback(() => {
    const { userInput, sourceText, timer, user, enableSave } = stateRef.current;

    setIsTestActive(false);
    const correctChars = userInput
      .split("")
      .filter((c, i) => c === sourceText.content[i]).length;
    const accuracy =
      userInput.length > 0 ? (correctChars / userInput.length) * 100 : 0;

    const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
    
    const timeElapsed = 60 - timer;

    const minutes = timeElapsed > 0 ? timeElapsed / 60 : 1;
    
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const errorCount = userInput.length - correctChars;

    const finalResults = { wpm, accuracy, errorCount };
    setResults(finalResults);

    if (user && enableSave) {
      axios
        .post("/api/results/add", {
          wpm: wpm,
          accuracy: accuracy,
          errorCount: errorCount,
          text: sourceText.id,
        })
        .then(() => console.log("Result saved successfully"))
        .catch((err) =>
          console.error("Failed to save result:", err.response.data)
        );
    }
  }, []); 

  useEffect(() => {
    let interval;
    if (isTestActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isTestActive) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [isTestActive, timer, endTest]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (!isTestActive && value.length > 0 && results === null) {
      setIsTestActive(true);
    }
    if (results === null) {
      setUserInput(value);
    }
    if (value.length === sourceText.content.length) {
      endTest();
    }
  };

  const resetTest = useCallback(() => {
    setIsTestActive(false);
    setTimer(60);
    setUserInput("");
    setResults(null);
  }, []);

  useEffect(() => {
    setSourceText(initialTextObj);
    resetTest();
  }, [initialTextObj, resetTest]);

  return {
    endTest,
    sourceText,
    userInput,
    timer,
    isTestActive,
    results,
    handleInputChange,
    resetTest,
  };
};
