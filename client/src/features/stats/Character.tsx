import React from 'react';

interface CharacterProps {
  chr: string;
  id: number;
  chrsTyped: Array<string>;
  done: boolean;
}

const Character: React.FC<CharacterProps> = ({ chr, id, chrsTyped, done }) => {
  const isTyped = id < chrsTyped.length;
  const isCorrect = isTyped && chr === chrsTyped[id];

  const style: React.CSSProperties = done
    ? { color: 'rgb(60, 62, 63)', pointerEvents: 'none' }
    : isTyped
    ? isCorrect
      ? { color: 'green' }
      : { color: 'red' } 
    : {};

  return (
      <span style={style} className='text'>{chr}</span>
  );
};

export default Character;