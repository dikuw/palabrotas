import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px;
  border-radius: 4px;
  background-color: ${props => {
    switch(props.type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      default: return '#2196F3';
    }
  }};
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${props => props.$isClosing ? slideOut : slideIn} 0.5s ease-in-out;
`;

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 500); // Wait for animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <NotificationWrapper type={type} $isClosing={isClosing}>
      {message}
    </NotificationWrapper>
  );
};

export default Notification;