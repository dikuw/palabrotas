import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const QualityButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const QualityButton = styled.button`
  background-color: ${props => {
    if (props.$quality === 'Again') return '#f44336';
    if (props.$quality === 'Hard') return '#ff9800';
    if (props.$quality === 'Good') return '#8bc34a';
    if (props.$quality === 'Easy') return '#4caf50';
  }};
  color: #fff;
  border: none;
  padding: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: opacity 0.3s;
  width: 22%; // Adjusted for 4 buttons
  margin: 0 1%;

  &:hover {
    opacity: 0.8;
  }
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const qualityLabels = ['Again', 'Hard', 'Good', 'Easy'];

export default function Flashcard({ item, onNext }) {
  const { t } = useTranslation();
  const { updateStreak } = useUserStore();
  const { authStatus } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);
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

  const renderHint = () => {
    if (!item.content.hint || item.content.hint.trim() === '') {
      return <Hint>{t("No hint provided")}</Hint>;
    }
    return <FormattedHint hint={item.content.hint} />;
  };

  const handleAnswer = async (quality) => {
    if (!authStatus.isLoggedIn || !authStatus.user) {
      console.error('User is not logged in');
      return;
    }

    try {
      if (quality === 'Again') {
        // Keep the flashcard in the queue
        await onNext(item._id, quality, true);
      } else {
        await onNext(item._id, quality, false);
      }

      const result = await updateStreak(authStatus.user._id);

      if (result.updated) {
        addNotification(t(`Streak updated! Current streak: {{streak}}`, { streak: result.streak }), 'success');
      }

      setIsFlipped(false);
      setShowHint(false);
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      addNotification(t('Error updating flashcard review'), 'error');
    }
  };

  return (
    <FlashcardContainer onClick={handleFlip}>
      <FlashcardInner $isFlipped={isFlipped}>
        <FlashcardFront>
          <Title>{item.content.title}</Title>
          {showHint && (
            <Hint>
              {renderHint()}
            </Hint>
          )}
          <QuestionIconWrapper>          
            <Tooltip text={t("Show hint")}>
              <StyledQuestionIcon onClick={handleHint} />
            </Tooltip>
          </QuestionIconWrapper>
        </FlashcardFront>
        <FlashcardBack>
          <ContentContainer>
            <p>{item.content.description}</p>
            <p>{item.content.exampleSentence}</p>
          </ContentContainer>
          <QualityButtonsContainer>
            {qualityLabels.map(quality => (
              <QualityButton 
                key={quality} 
                $quality={quality} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(quality);
                }}
              >
                {t(quality)}
              </QualityButton>
            ))}
          </QualityButtonsContainer>
        </FlashcardBack>
      </FlashcardInner>
    </FlashcardContainer>
  );
};