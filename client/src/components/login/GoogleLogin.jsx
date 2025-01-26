import React from 'react';
import { FaGoogle } from "react-icons/fa6";
import styled from 'styled-components';

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 24px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #f5f5f5;
  }
`;

export default function GoogleLogin() {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <GoogleButton onClick={handleGoogleLogin}>
      <FaGoogle style={{ fontSize: '18px' }} />
      Continue with Google
    </GoogleButton>
  );
}