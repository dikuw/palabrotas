import React, { useState } from 'react';
import { FaQuestionCircle, FaCheck, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';

import FormattedHint from './FlashcardHint';
import Tooltip from '../shared/Tooltip';

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

const FlashcardFront = styled(FlashcardFace)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FlashcardBack = styled(FlashcardFace)`
  transform: rotateY(180deg);
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Hint = styled.div`
  margin: 5px 0;
  font-style: italic;
`;

const QuestionIconWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledQuestionIcon = styled(FaQuestionCircle)`
  cursor: pointer;
  margin-left: 10px;
`;

const AnswerButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 20px;
`;

const AnswerButton = styled.button`
  background-color: ${props => props.$correct ? '#4CAF50' : '#f44336'};
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.$correct ? '#45a049' : '#da190b'};
  }
`;

export default function Flashcard({ item, onNext }) {
  const { t } = useTranslation();
  const { updateStreak } = useUserStore();
  const { authStatus } = useAuthStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowHint(false);
  };

  const handleHint = (e) => {
    e.stopPropagation();
    setShowHint(true);
  };

  const handleAnswer = async (correct) => {
    if (!authStatus.isLoggedIn || !authStatus.user) {
      console.error('User is not logged in');
      return;
    }

    try {
      await updateStreak(authStatus.user._id);
      // You might want to do something with the result, like showing a notification
      onNext();
      setIsFlipped(false);
      setShowHint(false);
    } catch (error) {
      console.error('Error updating streak:', error);
      // Handle error (e.g., show an error notification)
    }
  };

  return (
    <FlashcardContainer onClick={handleFlip}>
      <FlashcardInner $isFlipped={isFlipped}>
        <FlashcardFront>
          <Title>{item.title}</Title>
          {showHint && (
            <Hint>
              <FormattedHint hint={item.hint} />
            </Hint>
          )}
          <QuestionIconWrapper>          
            <Tooltip text={t("Show hint")}>
              <StyledQuestionIcon onClick={handleHint} />
            </Tooltip>
          </QuestionIconWrapper>
        </FlashcardFront>
        <FlashcardBack>
          <p>{item.description}</p>
          <p>{item.exampleSentence}</p>
          <AnswerButtonsContainer>
            <AnswerButton $correct onClick={() => handleAnswer(true)}>
              <FaCheck />
            </AnswerButton>
            <AnswerButton onClick={() => handleAnswer(false)}>
              <FaTimes />
            </AnswerButton>
          </AnswerButtonsContainer>
        </FlashcardBack>
      </FlashcardInner>
    </FlashcardContainer>
  );
};