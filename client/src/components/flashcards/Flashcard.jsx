import React, { useState } from 'react';
import { FaQuestionCircle, FaArrowRight } from 'react-icons/fa';
import styled from 'styled-components';

const FlashcardContainer = styled.div`
  width: 100%;
  margin: 0 0 2rem 0;
  padding: 2rem;
  height: 300px;
  perspective: 1000px;
`;

const FlashcardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  ${props => props.$isFlipped && 'transform: rotateY(180deg);'}
`;

const FlashcardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const FlashcardFront = styled(FlashcardFace)``;

const FlashcardBack = styled(FlashcardFace)`
  transform: rotateY(180deg);
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Hint = styled.p`
  margin: 5px 0;
  font-style: italic;
`;

const QuestionIcon = styled(FaQuestionCircle)`
  position: absolute;
  bottom: 10px;
  cursor: pointer;
  font-size: 24px;
  color: #007bff;
`;

const NextButton = styled(FaArrowRight)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: #007bff;
`;

export default function Flashcard({ item, onNext }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setHintLevel(0);
  };

  const handleHint = (e) => {
    e.stopPropagation();
    setHintLevel(prev => (prev < 3 ? prev + 1 : prev));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onNext();
    setIsFlipped(false);
    setHintLevel(0);
  };

  return (
    <FlashcardContainer onClick={handleFlip}>
      <FlashcardInner $isFlipped={isFlipped}>
        <FlashcardFront>
          <Title>{item.title}</Title>
          {hintLevel >= 1 && <Hint>{item.hint1}</Hint>}
          {hintLevel >= 2 && <Hint>{item.hint2}</Hint>}
          {hintLevel >= 3 && <Hint>{item.hint3}</Hint>}
          <QuestionIcon onClick={handleHint} />
          <NextButton onClick={handleNext} />
        </FlashcardFront>
        <FlashcardBack>
          <p>{item.description}</p>
          <p>{item.exampleSentence}</p>
          <NextButton onClick={handleNext} />
        </FlashcardBack>
      </FlashcardInner>
    </FlashcardContainer>
  );
};