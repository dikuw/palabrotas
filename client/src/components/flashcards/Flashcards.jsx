import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '../../store/auth';
import { useFlashcardStore } from '../../store/flashcard';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';

import Flashcard from './Flashcard';

const StyledWrapperDiv = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 4px;
`;

const FlashcardCounter = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.8em;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 1em;
`;

export default function Flashcards() {
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { flashcards, dueFlashcards, getFlashcards, getDueFlashcards, updateFlashcardReview } = useFlashcardStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authStatus.isLoggedIn && authStatus.user) {
      getFlashcards(authStatus.user._id);
      getDueFlashcards(authStatus.user._id);
    }
  }, [authStatus.isLoggedIn, authStatus.user, getFlashcards, getDueFlashcards]);

  const handleReviewAndNext = async (flashcardId, quality, keepInQueue) => {
    try {
      setIsLoading(true);
      await updateFlashcardReview(flashcardId, quality, keepInQueue);
      
      if (!keepInQueue) {
        const updatedDueFlashcards = dueFlashcards.filter(card => card._id !== flashcardId);
        useFlashcardStore.setState({ dueFlashcards: updatedDueFlashcards });
        setCurrentIndex(prevIndex => prevIndex % updatedDueFlashcards.length);
      } else {
        // Move the current card to the end of the deck
        const currentCard = dueFlashcards[currentIndex];
        const remainingCards = dueFlashcards.filter((_, index) => index !== currentIndex);
        const reorderedCards = [...remainingCards, currentCard];
        useFlashcardStore.setState({ dueFlashcards: reorderedCards });
        setCurrentIndex(0);
      }
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      setIsLoading(false);
    }
  };

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }

  return (
    <StyledWrapperDiv>
      {flashcards.length > 0 ? (
        dueFlashcards.length > 0 ? (
          <>
            <Flashcard 
              item={dueFlashcards[currentIndex]} 
              onNext={handleReviewAndNext}
              isLoading={isLoading}
            />
            <FlashcardCounter>
              {dueFlashcards.length} {t('remaining')}
            </FlashcardCounter>
          </>
        ) : (
          <Message>{t("You've completed all your flashcards for today. Please come back tomorrow.")}</Message>
        )
      ) : (
        <Message>{t("You don't have any flashcards yet.")}</Message>
      )}
    </StyledWrapperDiv>
  );
};
