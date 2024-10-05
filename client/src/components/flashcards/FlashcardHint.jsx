import React from 'react';
import styled from 'styled-components';

const HintContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 1.5em;
  margin: 10px 0;
`;

const HintCharacter = styled.span`
  display: inline-block;
  width: 1em;
  height: 1.5em;
  margin: 0 2px;
  border-bottom: 2px solid #000;
  font-weight: bold;
  text-align: center;
  line-height: 1.5em;
`;

const HintSpace = styled.span`
  display: inline-block;
  width: 1em;
`;

export default function FormattedHint({ hint }) {
  return (
    <HintContainer>
      {hint.split('').map((char, index) => {
        if (char === '_') {
          return <HintCharacter key={index}></HintCharacter>;
        } else if (char === ' ') {
          return <HintSpace key={index} />;
        } else {
          return <HintCharacter key={index}>{char}</HintCharacter>;
        }
      })}
    </HintContainer>
  );
}
