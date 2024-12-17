import React from 'react';
import { FaGoogle } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { VisibleActionButton } from '../shared/index.js';
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

const GoogleButton = styled.button`
  background-color: #4285f4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  padding: 10px 24px;
  width: fit-content;
  min-width: 220px;
  align-self: center;
  font-size: 14px;
  
  &:hover {
    background-color: #357ae8;
  }
  
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  span {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
`;

export default function GoogleLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { googleLogin } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      navigate("/");
      addNotification(t('Logged in successfully!'), 'success');
    } catch (error) {
      addNotification(t('Login failed. Please try again.'), 'error');
    }
  };

  return (
    <GoogleButton onClick={handleGoogleLogin}>
      <FaGoogle />
      <span>{t("Continue with Google")}</span>
    </GoogleButton>
  );
}