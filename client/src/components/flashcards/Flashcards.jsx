import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '../../store/auth';
import { useFlashcardStore } from '../../store/flashcard';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';

import Banner from '../header/Banner';
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

export default function Account() {
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { flashcards, getFlashcards } = useFlashcardStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (authStatus.isLoggedIn && authStatus.user) {
      getFlashcards(authStatus.user._id);
    }
  }, [authStatus.isLoggedIn, authStatus.user, getFlashcards]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }
  return (
    <StyledWrapperDiv>
      <Banner bannerString={t("Your Flashcards")} />
      {flashcards.length > 0 ? (
        <>
          <Flashcard 
            item={flashcards[currentIndex].content} 
            onNext={handleNext}
          />
          <FlashcardCounter>
            {currentIndex + 1} {t('of')} {flashcards.length}
          </FlashcardCounter>
        </>
      ) : (
        <p>{t("You don't have any flashcards yet.")}</p>
      )}
    </StyledWrapperDiv>
  );
};
