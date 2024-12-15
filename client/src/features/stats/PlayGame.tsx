import '../../css/home.css';
import React, { useEffect, useState, useMemo } from 'react';
import useKeyPress from '../../utils/useKeyPress';
import Box from '@material-ui/core/Box';
import Character from './Character';

interface PlayGameProps {
  text?: string;
}

const PlayGame: React.FC<PlayGameProps> = ({ text }) => {
  const textByLine = useMemo(() => (text ?? '').split('\n'), [text]);

  const [chrsTyped, setChrsTyped] = useState<Array<string>>([]);
  const [charsToType, setCharsToType] = useState<Array<string>>([]);
  const [seconds, setSeconds] = useState<number>(15);
  const [typingStarted, setTypingStarted] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [finalWpm, setFinalWpm] = useState<number>(0);
  const [finalAccuracy, setFinalAccuracy] = useState<number>(0);

  useEffect(() => {
    const chars = textByLine
      .map((line) => line.trim().split("").map((c) => c))
      .flat();
    setCharsToType(chars);
  }, [textByLine]);

  useKeyPress((key: any) => {
    if (!done && key) {
      if (!typingStarted) {
        setTypingStarted(true);
      }

      if (key !== "Backspace") {
        setChrsTyped((prevChrsTyped) => [...prevChrsTyped, key]);
      } else {
        setChrsTyped((prevChrsTyped) => prevChrsTyped.slice(0, -1) ); 
      } 
    } 
  });

  useEffect(() => {
    if (typingStarted) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            clearInterval(timer);
            setDone(true);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }
  }, [typingStarted]);

  useEffect(() => {
    if (done) {
      calculateFinalStats();
    }
  }, [done]);

  const calculateFinalStats = () => {
    const correct = chrsTyped.reduce((acc, chr, i) => {
      return chr === charsToType[i] ? acc + 1 : acc;
    }, 0);

    const accuracy = (correct / chrsTyped.length) * 100;
    setFinalAccuracy(accuracy);

    const wpm = (chrsTyped.length / 5) / (15 / 60);
    setFinalWpm(wpm);
  };

  const wpm = done ? finalWpm : (chrsTyped.length / 5) / (15 / 60);
  const accuracy = done
    ? finalAccuracy
    : (chrsTyped.reduce((acc, chr, i) => (chr === charsToType[i] ? acc + 1 : acc), 0) / chrsTyped.length) * 100;

  const accuracyText = `${done ? finalAccuracy.toFixed(0) : accuracy.toFixed(0)}%`;

  return (
    <div className="playgame--container">
      <h3>Start typing!</h3>
      <div className="seconds">{seconds}</div>
      {textByLine.map((line, i) => (
        <Box key={i} className="text--box">
          {line.trim().split("").map((chr, idx) => (
            <Character
              chr={chr}
              key={idx}
              id={idx}
              chrsTyped={chrsTyped}
            />
          ))}
        </Box>
      ))}
      {seconds <= 0 && (
        <div className="endgame--stats">
          <p className="acc--text">Accuracy: {accuracyText}</p>
          <p>{wpm.toFixed(0)} Words Per Minute</p>
        </div>
      )}
    </div>
  );
};

export default PlayGame;
