import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { FaVolumeUp, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useCourseStore } from '../../store/course';

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  min-height: 120px;
  padding: 1.5rem;
  background-color: white;
  border: 2px solid var(--secondary);
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EnglishText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary);
  flex: 1;
`;

const SpanishText = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
  margin-top: 0.5rem;
  min-height: 1.5rem;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid var(--secondary);
  border-radius: 20px;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.9rem;
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

const AudioButton = styled(ActionButton)`
  min-width: 120px;
  justify-content: center;
`;

const RevealButton = styled(ActionButton)`
  min-width: 140px;
  justify-content: center;
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
  const [revealedItems, setRevealedItems] = useState({});
  const [audioFiles, setAudioFiles] = useState({});
  const [currentAudioIndex, setCurrentAudioIndex] = useState({});
  const [audioElements, setAudioElements] = useState({});

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

  const toggleReveal = (itemId) => {
    setRevealedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const playAudio = (itemId) => {
    const files = audioFiles[itemId];
    if (!files || files.length === 0) return;

    const currentIndex = currentAudioIndex[itemId] || 0;
    const audioUrl = files[currentIndex].audioUrl;

    // Stop current audio if playing
    if (audioElements[itemId]) {
      audioElements[itemId].pause();
      audioElements[itemId].currentTime = 0;
    }

    // Play current audio
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });

    setAudioElements(prev => ({
      ...prev,
      [itemId]: audio
    }));
  };

  const cycleAudio = (itemId) => {
    const files = audioFiles[itemId];
    if (!files || files.length === 0) return;

    const currentIndex = currentAudioIndex[itemId] || 0;
    const nextIndex = (currentIndex + 1) % files.length;
    
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

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <CardsContainer>
        <PlaceholderText>{t("No vocabulary content available")}</PlaceholderText>
      </CardsContainer>
    );
  }

  return (
    <CardsContainer>
      {vocabulary.map((item) => {
        const isRevealed = revealedItems[item._id] || false;
        const files = audioFiles[item._id] || [];
        const currentIndex = currentAudioIndex[item._id] || 0;
        const hasAudio = files.length > 0;

        return (
          <Card key={item._id}>
            <CardHeader>
              <EnglishText>{item.description}</EnglishText>
              <ButtonContainer>
                {hasAudio && (
                  <>
                    <AudioButton onClick={() => playAudio(item._id)}>
                      <FaVolumeUp />
                      {t("Play")}
                    </AudioButton>
                    {files.length > 1 && (
                      <AudioButton onClick={() => cycleAudio(item._id)}>
                        {t("Next")} ({currentIndex + 1}/{files.length})
                      </AudioButton>
                    )}
                  </>
                )}
                <RevealButton onClick={() => toggleReveal(item._id)}>
                  {isRevealed ? (
                    <>
                      <FaEyeSlash />
                      {t("Hide")}
                    </>
                  ) : (
                    <>
                      <FaEye />
                      {t("Reveal")}
                    </>
                  )}
                </RevealButton>
              </ButtonContainer>
            </CardHeader>
            <SpanishText $isVisible={isRevealed}>
              {isRevealed ? item.title : '••••••'}
            </SpanishText>
          </Card>
        );
      })}
    </CardsContainer>
  );
}

