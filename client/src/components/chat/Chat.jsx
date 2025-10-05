import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa';

import { useAuthStore } from '../../store/auth';
import { useChatStore } from '../../store/chat';
import { useNotificationStore } from '../../store/notification';
import { useAvatarStore } from '../../store/avatar';
import Spinner from '../shared/Spinner';

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 9px;
  border: 1px solid #000;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  height: 600px;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: var(--almostWhite);
  scroll-behavior: smooth;
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  ${props => props.$isUser ? `
    background-color: var(--primary);
    color: white;
    margin-left: auto;
    text-align: right;
  ` : `
    background-color: white;
    color: black;
    border: 1px solid #ddd;
  `}
`;

const MessageRole = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
  opacity: 0.8;
`;

const MessageContent = styled.div`
  line-height: 1.4;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 25px;
  background-color: white;
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 15px;
  font-size: 16px;
  background: transparent;
  
  &::placeholder {
    color: #999;
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$isRecording ? `
    background-color: #f44336;
    color: white;
    animation: pulse 1.5s infinite;
  ` : `
    background-color: var(--primary);
    color: white;
    
    &:hover {
      background-color: var(--primaryDark);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 50px;
`;

const AvatarSection = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto 0;
  padding: 20px;
  background-color: white;
  border-radius: 9px;
  border: 1px solid #000;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarTitle = styled.h3`
  margin: 0 0 15px 0;
  color: var(--primary);
  font-size: 1.2rem;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
`;

const AvatarImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--primary);
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarPlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
  text-align: center;
`;

const AvatarLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
`;

export default function Chat() {
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { 
    currentChat, 
    messages, 
    isLoading, 
    createChat, 
    sendMessage, 
    getChats,
    loadChat,
    chats
  } = useChatStore();
  const { 
    avatars, 
    isLoading: avatarsLoading, 
    getAvatars 
  } = useAvatarStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (authStatus.isLoggedIn && authStatus.user) {
      loadExistingChats();
      loadUserAvatars();
    }
  }, [authStatus.isLoggedIn]);

  const loadUserAvatars = async () => {
    try {
      await getAvatars(authStatus.user._id);
    } catch (error) {
      console.error('Error loading avatars:', error);
      // Don't show notification for avatar loading errors as it's not critical
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'es-ES'; // Spanish language
      
      recognitionInstance.onstart = () => {
        setIsRecording(true);
        addNotification(t('Listening...'), 'info');
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsProcessingAudio(false);
        addNotification(t('Speech recognized!'), 'success');
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessingAudio(false);
        
        let errorMessage = t('Speech recognition failed');
        if (event.error === 'no-speech') {
          errorMessage = t('No speech detected');
        } else if (event.error === 'not-allowed') {
          errorMessage = t('Microphone access denied');
        }
        
        addNotification(errorMessage, 'error');
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
        setIsProcessingAudio(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, [t, addNotification]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const loadExistingChats = async () => {
    try {
      const fetchedChats = await getChats(authStatus.user._id);
      
      if (fetchedChats.length > 0) {
        // Load the last chat in the array (most recent)
        const mostRecentChat = fetchedChats[fetchedChats.length - 1];
        loadChat(mostRecentChat);
      } else {
        // If no chats exist, create a new one
        await createChat(authStatus.user._id, 'New Chat');
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      addNotification(t('Failed to load chats'), 'error');
    }
  };

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || !currentChat) return;

    setInputValue('');

    try {
      await sendMessage(authStatus.user._id, currentChat._id, messageContent);
    } catch (error) {
      console.error('Error sending message:', error);
      addNotification(t('Failed to send message'), 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const startRecording = () => {
    if (recognition && !isRecording) {
      setIsProcessingAudio(true);
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  const handleRecordingClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!authStatus.isLoggedIn) {
    return (
      <ChatContainer>
        <EmptyState>
          <p>{t('Please log in to use the chat feature')}</p>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <>
      {/* Avatar Section */}
      <AvatarSection>
        {avatarsLoading ? (
          <AvatarLoading>
            <Spinner size="20px" />
            <span style={{ marginLeft: '10px' }}>{t('Loading avatars...')}</span>
          </AvatarLoading>
        ) : avatars.length > 0 ? (
          <AvatarContainer>
            {avatars.map((avatar) => (
              <AvatarImage
                key={avatar._id}
                src={avatar.imageUrl}
                alt={avatar.description}
                title={avatar.description}
                onClick={() => {
                  // Optional: Add click handler for avatar actions
                  console.log('Avatar clicked:', avatar);
                }}
              />
            ))}
          </AvatarContainer>
        ) : (
          <AvatarPlaceholder>
            {t('No avatars yet')}
          </AvatarPlaceholder>
        )}
      </AvatarSection>

      {/* Chat Container */}
      <ChatContainer>
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <p>{t('Start a conversation with your Spanish tutor!')}</p>
            <p>{t('Type a message or use the microphone to record audio.')}</p>
          </EmptyState>
        ) : (
          messages.map((message, index) => (
            <Message key={index} $isUser={message.role === 'user'}>
              <MessageRole>
                {message.role === 'user' ? t('You') : t('Tutor')}
              </MessageRole>
              <MessageContent>{message.content}</MessageContent>
            </Message>
          ))
        )}
        
        {isLoading && (
          <SpinnerContainer>
            <Spinner size="30px" />
          </SpinnerContainer>
        )}
        
      </MessagesContainer>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <TextInput
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('Type your message...')}
            disabled={isLoading}
          />
          
          <ActionButton
            type="button"
            onClick={handleRecordingClick}
            $isRecording={isRecording}
            disabled={isLoading || isProcessingAudio || !recognition}
            title={
              !recognition 
                ? t('Speech recognition not supported') 
                : isRecording 
                  ? t('Stop recording') 
                  : t('Start recording')
            }
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </ActionButton>
          
          <ActionButton
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            title={t('Send message')}
          >
            <FaPaperPlane />
          </ActionButton>
        </InputContainer>
      </form>
      </ChatContainer>
    </>
  );
}
