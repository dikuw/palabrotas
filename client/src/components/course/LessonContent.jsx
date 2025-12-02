import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { FaVolumeUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCourseStore } from '../../store/course';

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  padding: 2rem;
  background-color: white;
  border: 2px solid var(--secondary);
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EnglishText = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
  text-align: center;
`;

const SpanishText = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary);
  text-align: center;
  min-height: 2.5rem;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const AudioButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

const AudioButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--secondary);
  border-radius: 20px;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 1.5rem;
`;

const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--secondary);
  border-radius: 20px;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const CardCounter = styled.div`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
`;

const PlaceholderText = styled.p`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 2rem;
`;

export default function LessonContent({ vocabulary }) {
  const { t } = useTranslation();
  const { getContentAudioFiles } = useCourseStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedItems, setRevealedItems] = useState({});
  const [audioFiles, setAudioFiles] = useState({});
  const [currentAudioIndex, setCurrentAudioIndex] = useState({});
  const [audioElements, setAudioElements] = useState({});

  useEffect(() => {
    // Reset revealed state when vocabulary changes
    setRevealedItems({});
    setCurrentIndex(0);
    setCurrentAudioIndex({});
  }, [vocabulary]);

  useEffect(() => {
    // Fetch audio files for all vocabulary items
    const fetchAudioFiles = async () => {
      const audioFilesMap = {};
      for (const item of vocabulary) {
        const files = await getContentAudioFiles(item._id);
        if (files && files.length > 0) {
          audioFilesMap[item._id] = files;
        }
      }
      setAudioFiles(audioFilesMap);
    };

    if (vocabulary && vocabulary.length > 0) {
      fetchAudioFiles();
    }
  }, [vocabulary, getContentAudioFiles]);

  const handleCardClick = (itemId, e) => {
    // Don't reveal if clicking on audio button
    if (e.target.closest('button')) {
      return;
    }
    setRevealedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleAudioClick = (itemId, e) => {
    e.stopPropagation();
    const files = audioFiles[itemId];
    if (!files || files.length === 0) return;

    // Get current audio index for this item
    let currentAudioIdx = currentAudioIndex[itemId] || 0;
    
    // Cycle to next audio (1, 2, 3, then back to 1)
    const nextIndex = (currentAudioIdx + 1) % files.length;
    
    setCurrentAudioIndex(prev => ({
      ...prev,
      [itemId]: nextIndex
    }));

    // Stop current audio if playing
    if (audioElements[itemId]) {
      audioElements[itemId].pause();
      audioElements[itemId].currentTime = 0;
    }

    // Play new audio
    const audio = new Audio(files[nextIndex].audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });

    setAudioElements(prev => ({
      ...prev,
      [itemId]: audio
    }));
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Reset revealed state for new card
      const prevItemId = vocabulary[currentIndex - 1]._id;
      setRevealedItems(prev => ({
        ...prev,
        [prevItemId]: false
      }));
    }
  };

  const goToNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Reset revealed state for new card
      const nextItemId = vocabulary[currentIndex + 1]._id;
      setRevealedItems(prev => ({
        ...prev,
        [nextItemId]: false
      }));
    }
  };

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <CardsContainer>
        <PlaceholderText>{t("No vocabulary content available")}</PlaceholderText>
      </CardsContainer>
    );
  }

  const currentItem = vocabulary[currentIndex];
  const isRevealed = revealedItems[currentItem._id] || false;
  const files = audioFiles[currentItem._id] || [];
  const currentAudioIdx = currentAudioIndex[currentItem._id] || 0;
  const hasAudio = files.length > 0;

  return (
    <CardsContainer>
      <CardWrapper>
        <Card onClick={(e) => handleCardClick(currentItem._id, e)}>
          <CardContent>
            <EnglishText>{currentItem.description}</EnglishText>
            <SpanishText $isVisible={isRevealed}>
              {isRevealed ? currentItem.title : '••••••'}
            </SpanishText>
            {hasAudio && (
              <AudioButtonContainer>
                <AudioButton onClick={(e) => handleAudioClick(currentItem._id, e)}>
                  <FaVolumeUp />
                  {t("Hear it!")}
                </AudioButton>
              </AudioButtonContainer>
            )}
          </CardContent>
        </Card>
      </CardWrapper>
      <NavigationContainer>
        <NavButton onClick={goToPrevious} disabled={currentIndex === 0}>
          <FaChevronLeft />
          {t("Previous")}
        </NavButton>
        <CardCounter>
          {currentIndex + 1} / {vocabulary.length}
        </CardCounter>
        <NavButton onClick={goToNext} disabled={currentIndex === vocabulary.length - 1}>
          {t("Next")}
          <FaChevronRight />
        </NavButton>
      </NavigationContainer>
    </CardsContainer>
  );
}

