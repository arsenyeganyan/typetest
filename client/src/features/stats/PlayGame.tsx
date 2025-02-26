import '../../css/home.css';
import  { useEffect, useState, useMemo } from 'react';
import useKeyPress from '../../utils/useKeyPress';
import Box from '@material-ui/core/Box';
import Character from './Character';
import { useAddTestMutation } from './statsApiSlice';
import { useGetSessionQuery } from '../auth/authApiSlice';
import { generateRandomParagraph } from '../../utils/genRandomText';;

const PlayGame = () => {
  const [chrsTyped, setChrsTyped] = useState<Array<string>>([]);
  const [charsToType, setCharsToType] = useState<Array<string>>([]);
  const [seconds, setSeconds] = useState<number>(15);
  const [typingStarted, setTypingStarted] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [finalWpm, setFinalWpm] = useState<number>(0);
  const [finalAccuracy, setFinalAccuracy] = useState<number>(0);
  const [reseted, setReseted] = useState<boolean>(false);
  const [internalText, setInternalText] = useState<String>(generateRandomParagraph(15));

  useEffect(() => {
    if (reseted) {
      setChrsTyped([]);
      setSeconds(15);
      setDone(false);
      setFinalAccuracy(0);
      setFinalWpm(0);
      setTypingStarted(false);

      setInternalText(generateRandomParagraph(15));
    }
  }, [reseted]);

  let textByLine = useMemo(() => (internalText ?? '').split('\n'), [internalText]);

  const [addTest, { isLoading }] = useAddTestMutation();
  if(isLoading) {
    console.log('loading test adding operation...');
  }

  const { data: response } = useGetSessionQuery();

  //done debug log
  useEffect(() => {
    console.log("done state updated: ", done);
  }, [done]);

  //sets the text
  useEffect(() => {
    const chars = textByLine
      .map((line) => line.trim().split("").map((c) => c))
      .flat();
    setCharsToType(chars);
  }, [textByLine]);

  useKeyPress((key: any) => {
    if (done) {
      console.log('game over, no more input!');
      return;
    }

    if (!done && key) {
      if (!typingStarted) {
        setTypingStarted(true);
      }

      if (key !== "Backspace") {
        setChrsTyped((prevChrsTyped) => [...prevChrsTyped, key]);
      } else {
        setChrsTyped((prevChrsTyped) => prevChrsTyped.slice(0, -1)); 
      }
    }
  });

  //timer logic
  useEffect(() => {
    if (typingStarted) {
      setReseted(false);
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
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

  const calculateFinalStats = async () => {
    const minLength = Math.min(chrsTyped.length, charsToType.length);
  
    const correct = chrsTyped.slice(0, minLength).reduce((acc, chr, i) => {
      return chr === charsToType[i] ? acc + 1 : acc;
    }, 0);
  
    const accuracy = (correct / minLength) * 100;
    setFinalAccuracy(accuracy);
  
    const timeTaken = 15 - seconds;
    const wpm = timeTaken > 0 ? (correct / 5) / (timeTaken / 60) : 0;
    setFinalWpm(wpm);
  
    console.log({
      correct,
      accuracy,
      wpm,
      chrsTypedLength: chrsTyped.length,
      charsToTypeLength: charsToType.length,
      minLength,
    });

    const addOperation = await addTest({ userId: response?.userId, wpm, accuracy }).unwrap();
    console.log(addOperation?.msg);
  };
  
  const accuracy = done
    ? finalAccuracy
    : (chrsTyped.reduce((acc, chr, i) => (chr === charsToType[i] ? acc + 1 : acc), 0) / charsToType.length) * 100;
  
  const wpm = done
    ? finalWpm
    : typingStarted && seconds > 0
    ? (chrsTyped.reduce((acc, chr, i) => (chr === charsToType[i] ? acc + 1 : acc), 0) / 5) / ((15 - seconds) / 60)
    : 0;

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
              done={done}
            />
          ))}
        </Box>
      ))}
      {seconds <= 0 && (
        <div className="endgame--stats">
          <p className="acc--text">Accuracy: {accuracyText}</p>
          <p>{wpm.toFixed(0)} Words Per Minute</p>
          <button onClick={() => setReseted(true)}>Start New</button>
        </div>
      )}
    </div>
  );
};

export default PlayGame;
