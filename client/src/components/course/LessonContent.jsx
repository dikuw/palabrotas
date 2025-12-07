import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaChevronLeft, FaChevronRight, FaComments } from 'react-icons/fa';
import { useCourseStore } from '../../store/course';
import { useChatStore } from '../../store/chat';
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';
import Spinner from '../shared/Spinner';

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

const SpinnerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 9px;
  border: 2px solid var(--secondary);
  max-width: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: var(--primary);
  font-size: 1.2rem;
`;

const ModalMessage = styled.p`
  margin: 0;
  color: #666;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--secondary);
  border-radius: 20px;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  ${props => props.$primary && `
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
    
    &:hover {
      background-color: var(--primaryDark);
    }
  `}
`;

export default function LessonContent({ vocabulary, lesson }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getContentAudioFiles } = useCourseStore();
  const { authStatus } = useAuthStore();
  const { createChat, getChatsByLesson, loadChat } = useChatStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedItems, setRevealedItems] = useState({});
  const [audioFiles, setAudioFiles] = useState({});
  const [currentAudioIndex, setCurrentAudioIndex] = useState({});
  const [audioElements, setAudioElements] = useState({});
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [existingChats, setExistingChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  useEffect(() => {
    // Reset revealed state when vocabulary changes
    setRevealedItems({});
    setCurrentIndex(0);
    setCurrentAudioIndex({});
  }, [vocabulary]);

  useEffect(() => {
    // Fetch audio files for all vocabulary items in parallel
    const fetchAudioFiles = async () => {
      setIsLoadingAudio(true);
      try {
        // Fetch all audio files in parallel instead of sequentially
        const audioFilesPromises = vocabulary.map(item => 
          getContentAudioFiles(item._id).then(files => ({
            itemId: item._id,
            files: files && files.length > 0 ? files : []
          }))
        );
        
        const results = await Promise.all(audioFilesPromises);
        const audioFilesMap = {};
        results.forEach(({ itemId, files }) => {
          if (files.length > 0) {
            audioFilesMap[itemId] = files;
          }
        });
        setAudioFiles(audioFilesMap);
      } catch (error) {
        console.error('Error fetching audio files:', error);
      } finally {
        setIsLoadingAudio(false);
      }
    };

    if (vocabulary && vocabulary.length > 0) {
      fetchAudioFiles();
    } else {
      setIsLoadingAudio(false);
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

  const handleChatClick = async () => {
    if (!lesson || !authStatus.user) return;

    setIsLoadingChats(true);
    try {
      // Check for existing chats for this lesson
      const chats = await getChatsByLesson(authStatus.user._id, lesson._id);
      setExistingChats(chats || []);
      
      if (chats && chats.length > 0) {
        // Show modal to ask user
        setShowChatModal(true);
      } else {
        // No existing chats, create new one directly
        await createNewLessonChat();
      }
    } catch (error) {
      console.error('Error checking for existing chats:', error);
      addNotification(t('Failed to load chats'), 'error');
    } finally {
      setIsLoadingChats(false);
    }
  };

  const createNewLessonChat = async () => {
    if (!lesson || !authStatus.user) return;

    setShowChatModal(false);
    
    try {
      // Count existing chats for this lesson to determine the number
      const existingChatsCount = existingChats.length;
      const chatNumber = existingChatsCount + 1;
      const title = `Lesson ${lesson.lessonNumber} - ${chatNumber}`;

      // Create chat with lessonId (prompt will be taken from lesson.chatPrompt)
      await createChat(authStatus.user._id, title, null, lesson._id);
      
      // Navigate to chat page
      navigate('/chat');
    } catch (error) {
      console.error('Error creating new chat:', error);
      addNotification(t('Failed to create chat'), 'error');
    }
  };

  const useExistingChat = () => {
    if (existingChats.length > 0) {
      // Load the most recent chat (first in array since they're sorted by updatedAt desc)
      const latestChat = existingChats[0];
      loadChat(latestChat);
      
      // Navigate to chat page (Chat component will load all chats on mount)
      navigate('/chat');
    }
    setShowChatModal(false);
  };

  const handleModalClose = () => {
    setShowChatModal(false);
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
          {isLoadingAudio && (
            <SpinnerContainer>
              <Spinner size="40px" />
            </SpinnerContainer>
          )}
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
        <NavButton onClick={goToPrevious} disabled={currentIndex === 0 || isLoadingAudio}>
          <FaChevronLeft />
          {t("Previous")}
        </NavButton>
        <CardCounter>
          {currentIndex + 1} / {vocabulary.length}
        </CardCounter>
        <NavButton onClick={goToNext} disabled={currentIndex === vocabulary.length - 1 || isLoadingAudio}>
          {t("Next")}
          <FaChevronRight />
        </NavButton>
        {lesson && (
          <NavButton 
            onClick={handleChatClick} 
            disabled={isLoadingChats || isLoadingAudio}
            title={t("Open chat for this lesson")}
          >
            <FaComments />
            {t("Chat")}
          </NavButton>
        )}
      </NavigationContainer>
      
      {showChatModal && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t("Chat Already Exists")}</ModalTitle>
            <ModalMessage>
              {t("You already have")} {existingChats.length} {existingChats.length === 1 ? t("chat") : t("chats")} {t("for this lesson. Would you like to use an existing chat or create a new one?")}
            </ModalMessage>
            <ModalButtons>
              <ModalButton onClick={handleModalClose}>
                {t("Cancel")}
              </ModalButton>
              <ModalButton onClick={useExistingChat} $primary>
                {t("Use Existing")}
              </ModalButton>
              <ModalButton onClick={createNewLessonChat} $primary>
                {t("New Chat")}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </CardsContainer>
  );
}

