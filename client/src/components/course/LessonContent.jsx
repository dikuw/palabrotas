import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { FaVolumeUp, FaChevronLeft, FaChevronRight, FaComments, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
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
  height: 250px;
  padding: 2rem;
  background-color: white;
  border: 2px solid var(--secondary);
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100%;
  flex: 1;
  min-height: 0;
`;

const EnglishText = styled.div`
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 600;
  color: var(--primary);
  text-align: center;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const SpanishText = styled.div`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--secondary);
  text-align: center;
  min-height: 2.5rem;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const AudioButtonContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`;

const ProgressIndicatorContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  width: 80px;
  height: 46px; /* width * tan(30°) ≈ 80 * 0.577 ≈ 46 */
  border: 2px solid #333;
  clip-path: polygon(0 100%, 100% 100%, 100% 0%);
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const TriangleSegment = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => {
    // Each segment is 25% of the width, positioned from left
    // Segment 1 (leftmost): 0-25% from left
    // Segment 2: 25-50% from left
    // Segment 3: 50-75% from left
    // Segment 4 (rightmost): 75-100% from left
    const leftPercent = (props.$segment - 1) * 25;
    return `${leftPercent}%`;
  }};
  width: 25%;
  height: 100%;
  clip-path: ${props => {
    // Right triangle with right angle at bottom-right (100%, 100%)
    // Hypotenuse goes from bottom-left (0, 100%) to top-right (100%, 0%)
    // At x position, the height from bottom is: y_from_bottom = (x / width) * height
    // So at x=0, y_from_bottom=0 (we're at bottom-left, full height from bottom)
    // At x=width, y_from_bottom=height (we're at top-right, 0 height from bottom)
    
    // For each segment (25% width slices from left):
    // Segment 1: x from 0% to 25% → height from bottom: 100% to 75%
    // Segment 2: x from 25% to 50% → height from bottom: 75% to 50%
    // Segment 3: x from 50% to 75% → height from bottom: 50% to 25%
    // Segment 4: x from 75% to 100% → height from bottom: 25% to 0%
    
    const segmentNum = props.$segment;
    const leftXPercent = (segmentNum - 1) * 25; // Left edge of segment in container
    const rightXPercent = segmentNum * 25; // Right edge of segment in container
    
    // Height from bottom at left edge: 100% - (leftXPercent / 100) * 100% = (100 - leftXPercent)%
    // Height from bottom at right edge: 100% - (rightXPercent / 100) * 100% = (100 - rightXPercent)%
    const heightFromBottomAtLeft = 100 - leftXPercent;
    const heightFromBottomAtRight = 100 - rightXPercent;
    
    // Create trapezoid: top follows hypotenuse, bottom is horizontal
    // Points: (left, top), (right, top), (right, bottom), (left, bottom)
    // Top edge follows the hypotenuse
    return `polygon(0% ${heightFromBottomAtLeft}%, 100% ${heightFromBottomAtRight}%, 100% 100%, 0% 100%)`;
  }};
  background: ${props => {
    if (!props.$visible) {
      return 'white';
    }
    const colors = ['#f44336', '#ff9800', '#ffeb3b', '#4caf50']; // red, orange, yellow, green
    return colors[props.$segment - 1];
  }};
  border-right: ${props => props.$segment < 4 ? '1px solid #333' : 'none'};
  transition: background 0.3s ease;
`;

const FeedbackButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  margin-top: auto;
`;

const FeedbackButton = styled.button`
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem);
  border: 2px solid var(--secondary);
  border-radius: 20px;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: clamp(100px, 20vw, 120px);
  flex-shrink: 1;

  &:hover:not(:disabled) {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.$variant === 'up' && `
    &:hover:not(:disabled) {
      background-color: #4caf50;
      border-color: #4caf50;
      color: white;
    }
  `}

  ${props => props.$variant === 'down' && `
    &:hover:not(:disabled) {
      background-color: #f44336;
      border-color: #f44336;
      color: white;
    }
  `}
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
`;

const AudioIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.$isLoading && css`
    animation: ${pulse} 1.5s ease-in-out infinite;
  `}
`;

const AudioButton = styled.button`
  padding: 0.5rem;
  border: 2px solid var(--secondary);
  border-radius: 50%;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
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
  padding: 0.75rem;
  border: 2px solid var(--secondary);
  border-radius: 50%;
  background-color: white;
  color: var(--primary);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 3rem;
  height: 3rem;

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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const { getContentAudioFiles, recordProgress, getLessonProgress, getContentProgress } = useCourseStore();
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
  const [contentProgress, setContentProgress] = useState({}); // Map of contentId -> consecutiveCorrect
  const [isRecordingProgress, setIsRecordingProgress] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    // Reset revealed state when vocabulary changes
    setRevealedItems({});
    setCurrentIndex(0);
    setCurrentAudioIndex({});
    setContentProgress({});
  }, [vocabulary]);

  useEffect(() => {
    // Fetch progress for the current content item when lesson changes or when navigating between cards
    const fetchProgress = async () => {
      if (lesson && lesson._id && authStatus.user && vocabulary && vocabulary.length > 0) {
        const currentItem = vocabulary[currentIndex];
        if (!currentItem || !currentItem._id) {
          return;
        }

        setIsLoadingProgress(true);
        try {
          const progress = await getContentProgress(lesson._id, currentItem._id);
          if (progress) {
            setContentProgress(prev => ({
              ...prev,
              [currentItem._id]: progress.consecutiveCorrect || 0
            }));
          }
        } catch (error) {
          console.error('Error fetching content progress:', error);
        } finally {
          setIsLoadingProgress(false);
        }
      }
    };

    fetchProgress();
  }, [lesson, authStatus.user, getContentProgress, currentIndex, vocabulary]);

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
    // Only reveal if not already revealed (one-way reveal, no toggle)
    setRevealedItems(prev => {
      if (prev[itemId]) {
        return prev; // Already revealed, don't change
      }
      return {
        ...prev,
        [itemId]: true
      };
    });
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
    if (!lesson || !authStatus.user) {
      console.error('Cannot open chat: missing lesson or user', { lesson, user: authStatus.user });
      return;
    }

    if (!lesson._id) {
      console.error('Lesson object missing _id:', lesson);
      addNotification(t('Lesson data is incomplete'), 'error');
      return;
    }

    console.log('Opening chat for lesson:', { 
      lessonId: lesson._id, 
      lessonNumber: lesson.lessonNumber,
      hasChatPrompt: !!lesson.chatPrompt 
    });

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

      console.log('Creating new lesson chat:', { 
        userId: authStatus.user._id, 
        title, 
        lessonId: lesson._id,
        lessonHasPrompt: !!lesson.chatPrompt 
      });

      // Create chat with lessonId (prompt will be taken from lesson.chatPrompt)
      const newChat = await createChat(authStatus.user._id, title, null, lesson._id);
      
      console.log('Chat created:', { 
        chatId: newChat._id, 
        messagesCount: newChat.messages?.length || 0 
      });
      
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
      console.log('Loading existing chat:', { 
        chatId: latestChat._id, 
        messagesCount: latestChat.messages?.length || 0 
      });
      loadChat(latestChat);
      
      // Navigate to chat page (Chat component will load all chats on mount)
      navigate('/chat');
    }
    setShowChatModal(false);
  };

  const handleModalClose = () => {
    setShowChatModal(false);
  };

  const handleProgressClick = async (isCorrect) => {
    if (!lesson || !lesson._id || !authStatus.user || isRecordingProgress) {
      console.log('handleProgressClick early return:', { 
        hasLesson: !!lesson, 
        hasLessonId: !!(lesson && lesson._id),
        hasUser: !!authStatus.user,
        isRecording: isRecordingProgress 
      });
      return;
    }

    const currentItem = vocabulary[currentIndex];
    if (!currentItem || !currentItem._id) {
      console.log('handleProgressClick: missing currentItem:', { currentItem, currentIndex });
      return;
    }

    console.log('handleProgressClick calling API:', { 
      lessonId: lesson._id, 
      contentId: currentItem._id, 
      isCorrect 
    });

    setIsRecordingProgress(true);
    try {
      await recordProgress(lesson._id, currentItem._id, isCorrect);
      
      // Always fetch updated progress for this specific content item after recording
      // Add a small delay to ensure database has committed the change
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const updatedProgress = await getContentProgress(lesson._id, currentItem._id);
      console.log('Updated progress for content:', { 
        contentId: currentItem._id, 
        progress: updatedProgress,
        consecutiveCorrect: updatedProgress?.consecutiveCorrect 
      });
      
      if (updatedProgress !== null && updatedProgress !== undefined) {
        setContentProgress(prev => ({
          ...prev,
          [currentItem._id]: updatedProgress.consecutiveCorrect || 0
        }));
      } else {
        console.warn('No progress returned for content:', currentItem._id);
      }
    } catch (error) {
      console.error('Error recording progress:', error);
      addNotification(error.message || t('Failed to record progress'), 'error');
    } finally {
      setIsRecordingProgress(false);
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
  const consecutiveCorrect = contentProgress[currentItem._id] || 0;

  return (
    <CardsContainer>
      <CardWrapper>
        <Card onClick={(e) => handleCardClick(currentItem._id, e)}>
          {authStatus.user && lesson && (
            <ProgressIndicatorContainer>
              {isLoadingProgress ? (
                <SpinnerContainer>
                  <Spinner />
                </SpinnerContainer>
              ) : (
                <>
                  <TriangleSegment $segment={1} $visible={consecutiveCorrect >= 0} />
                  <TriangleSegment $segment={2} $visible={consecutiveCorrect >= 1} />
                  <TriangleSegment $segment={3} $visible={consecutiveCorrect >= 2} />
                  <TriangleSegment $segment={4} $visible={consecutiveCorrect >= 3} />
                </>
              )}
            </ProgressIndicatorContainer>
          )}
          {(isLoadingAudio || hasAudio) && (
            <AudioButtonContainer>
              <AudioButton 
                onClick={(e) => handleAudioClick(currentItem._id, e)}
                disabled={isLoadingAudio || !hasAudio}
              >
                <AudioIcon $isLoading={isLoadingAudio}>
                  <FaVolumeUp />
                </AudioIcon>
              </AudioButton>
            </AudioButtonContainer>
          )}
          <CardContent>
            <EnglishText>{currentItem.description}</EnglishText>
            <SpanishText $isVisible={isRevealed}>
              {isRevealed ? currentItem.title : '••••••'}
            </SpanishText>
            {isRevealed && authStatus.user && lesson && (
              <FeedbackButtons>
                <FeedbackButton
                  $variant="down"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProgressClick(false);
                  }}
                  disabled={isRecordingProgress}
                >
                  <FaThumbsDown />
                </FeedbackButton>
                <FeedbackButton
                  $variant="up"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProgressClick(true);
                  }}
                  disabled={isRecordingProgress}
                >
                  <FaThumbsUp />
                </FeedbackButton>
              </FeedbackButtons>
            )}
          </CardContent>
        </Card>
      </CardWrapper>
      <NavigationContainer>
        <NavButton onClick={goToPrevious} disabled={currentIndex === 0 || isLoadingAudio}>
          <FaChevronLeft />
        </NavButton>
        <CardCounter>
          {currentIndex + 1} / {vocabulary.length}
        </CardCounter>
        <NavButton onClick={goToNext} disabled={currentIndex === vocabulary.length - 1 || isLoadingAudio}>
          <FaChevronRight />
        </NavButton>
        {lesson && (
          <NavButton 
            onClick={handleChatClick} 
            disabled={isLoadingChats || isLoadingAudio}
            title={t("Open chat for this lesson")}
          >
            <FaComments />
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

