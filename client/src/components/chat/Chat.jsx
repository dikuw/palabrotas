import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa';

import { useAuthStore } from '../../store/auth';
import { useChatStore } from '../../store/chat';
import { useNotificationStore } from '../../store/notification';
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
  const addNotification = useNotificationStore(state => state.addNotification);
  
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    if (authStatus.isLoggedIn && authStatus.user) {
      loadExistingChats();
    }
  }, [authStatus.isLoggedIn]);

  const loadExistingChats = async () => {
    try {
      await getChats(authStatus.user._id);
      
      // If we have chats but no current chat, load the first one
      if (chats.length > 0 && !currentChat) {
        loadChat(chats[0]);
      } else if (chats.length === 0) {
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll just show a placeholder message
        addNotification(t('Audio recording feature coming soon!'), 'info');
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      addNotification(t('Failed to start recording'), 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
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
            disabled={isLoading}
            title={isRecording ? t('Stop recording') : t('Start recording')}
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
  );
}
