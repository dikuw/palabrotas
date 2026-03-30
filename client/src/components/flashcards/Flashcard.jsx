import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { FaQuestionCircle, FaGlobe } from 'react-icons/fa';
import ReactCountryFlag from "react-country-flag";
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

import FormattedHint from './FlashcardHint';
import Tooltip from '../shared/Tooltip';
import Spinner from '../shared/Spinner';
import { isAllCountriesCode } from '../shared/countries';

const OuterContainer = styled.div`
  padding: 20px;
  padding-top: 0;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormWrapper = styled.div`
  position: relative;
  width: 99%;
  max-width: 800px;
  margin: 10px auto 20px;
  z-index: 1;
`;

const FlashcardContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 9px;
  border: 1px solid #000;
  padding: 20px;
  position: relative;
  z-index: 4;
  min-height: 300px;
  height: auto;
  perspective: 1000px;
`;

const BackgroundCard = styled.div`
  position: absolute;
  width: 100%;
  height: 60px;
  border-radius: 9px;
  border: 1px solid #000;
  background-color: var(--primary);
  z-index: ${props => 3 - props.$index};
  bottom: ${props => -5 - (props.$index * 10)}px;
  left: 0;
`;

const FlashcardInner = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  ${props => props.$isFlipped && 'transform: rotateY(180deg);'}
  visibility: ${props => props.$isLoading ? 'hidden' : 'visible'};
`;

const FlashcardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
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
  justify-content: flex-start;
`;

const FlashcardBack = styled(FlashcardFace)`
  transform: rotateY(180deg);
  justify-content: flex-start;
`;

/** Fills space above the footer so title + hint stay vertically centered in the face. */
const FrontMainBlock = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 0;
  width: 100%;
`;

const FrontFooter = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const Hint = styled.div`
  margin: 5px 0;
  font-style: italic;
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
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
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 12px;
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
  max-width: 100%;
  min-width: 0;

  p {
    margin: 0.35em 0;
    max-width: 100%;
    overflow-wrap: break-word;
    word-break: break-word;
  }
`;

const qualityLabels = ['Again', 'Hard', 'Good', 'Easy'];

// Add a styled container for the spinner
const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;

const StyledFlagIcon = styled(ReactCountryFlag)`
  position: absolute;
  top: 10px;
  left: 15px;
  font-size: 1.25rem !important;
  z-index: 6;
`;

const StyledGlobeIcon = styled(FaGlobe)`
  position: absolute;
  top: 10px;
  left: 15px;
  font-size: 1.25rem;
  z-index: 6;
  color: var(--primary);
`;

export default function Flashcard({ item, onNext, isLoading }) {
  const { t } = useTranslation();
  const { updateStreak } = useUserStore();
  const { authStatus } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);
  const innerRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    setCurrentItem(item);
    setIsFlipped(false);
    setShowHint(false);
  }, [item]);

  useEffect(() => {
    if (isLoading) {
      setIsFlipped(false);
    }
  }, [isLoading]);

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
      // Immediately hide current card
      if (quality === 'Again') {
        await onNext(currentItem._id, quality, true);
      } else {
        await onNext(currentItem._id, quality, false);
      }

      const result = await updateStreak(authStatus.user._id);
      if (result.updated) {
        addNotification(t(`Streak updated! Current streak: {{streak}}`, { streak: result.streak }), 'success');
      }
    } catch (error) {
      console.error('Error updating flashcard review:', error);
      addNotification(t('Error updating flashcard review'), 'error');
    }
  };

  /* Course/lesson vocabulary: English prompt is stored in description, Spanish in title (see LessonContent). */
  const content = currentItem.content;
  const isCourseContent = content?.isCourseContent === true;
  const frontMainText = isCourseContent ? content.description : content.title;
  const backMainText = isCourseContent ? content.title : content.description;

  const CARD_MIN_HEIGHT = 300;

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (!inner || !front || !back || isLoading) return;

    const syncHeight = () => {
      front.style.minHeight = '';
      back.style.minHeight = '';
      const fh = front.getBoundingClientRect().height;
      const bh = back.getBoundingClientRect().height;
      const h = Math.max(CARD_MIN_HEIGHT, Math.ceil(fh), Math.ceil(bh));
      inner.style.minHeight = `${h}px`;
      front.style.minHeight = `${h}px`;
      back.style.minHeight = `${h}px`;
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(front);
    ro.observe(back);
    return () => ro.disconnect();
  }, [
    isLoading,
    currentItem,
    frontMainText,
    backMainText,
    showHint,
    item?.content?.exampleSentence,
    item?.content?.hint,
  ]);

  return (
    <OuterContainer>
      <FormWrapper>
        <FlashcardContainer onClick={handleFlip}>
          {isLoading && (
            <SpinnerContainer>
              <Spinner size="40px" />
            </SpinnerContainer>
          )}
          <FlashcardInner ref={innerRef} $isFlipped={isFlipped} $isLoading={isLoading}>
            <FlashcardFront ref={frontRef}>
              {currentItem.content.country && !isFlipped && (
                isAllCountriesCode(currentItem.content.country) ? (
                  <StyledGlobeIcon title={t('All regions')} aria-label={t('All regions')} />
                ) : (
                  <StyledFlagIcon countryCode={currentItem.content.country} svg />
                )
              )}
              <FrontMainBlock>
                <Title>{frontMainText}</Title>
                {showHint && <Hint>{renderHint()}</Hint>}
              </FrontMainBlock>
              <FrontFooter>
                <QuestionIconWrapper>
                  <Tooltip text={t("Show hint")}>
                    <StyledQuestionIcon onClick={handleHint} />
                  </Tooltip>
                </QuestionIconWrapper>
              </FrontFooter>
            </FlashcardFront>
            <FlashcardBack ref={backRef}>
              <ContentContainer>
                <p>{backMainText}</p>
                <p>{currentItem.content.exampleSentence}</p>
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
        {[0, 1, 2].map((index) => (
          <BackgroundCard key={index} $index={index} />
        ))}
      </FormWrapper>
    </OuterContainer>
  );
};