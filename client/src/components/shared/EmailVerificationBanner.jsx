import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';

const Banner = styled.div`
  width: 100%;
  background: #fff8e6;
  border-bottom: 1px solid #f0d78c;
  color: #5c4b16;
  padding: 10px 16px;
  text-align: center;
  font-size: 0.9rem;
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  border: none;
  background: transparent;
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Status = styled.span`
  font-size: 0.85rem;
`;

export default function EmailVerificationBanner() {
  const { t } = useTranslation();
  const authStatus = useAuthStore(state => state.authStatus);
  const resendVerificationEmail = useAuthStore(state => state.resendVerificationEmail);
  const [isResending, setIsResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!authStatus.isLoggedIn || !authStatus.user || authStatus.user.emailVerified !== false) {
    return null;
  }

  const handleResend = async () => {
    setIsResending(true);
    setStatusMessage('');
    try {
      const result = await resendVerificationEmail();
      setStatusMessage(result.message || t('Verification email sent. Please check your inbox.'));
    } catch (error) {
      setStatusMessage(error.message || t('Unable to send verification email. Please try again later.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Banner>
      <Row>
        <span>
          {t('Please verify your email to unlock subscriptions and paid lessons.')}
        </span>
        <Button type="button" onClick={handleResend} disabled={isResending}>
          {isResending ? t('Sending...') : t('Resend verification email')}
        </Button>
      </Row>
      {statusMessage && <Status>{statusMessage}</Status>}
    </Banner>
  );
}
