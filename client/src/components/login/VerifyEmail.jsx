import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import Spinner from '../shared/Spinner';

const OuterContainer = styled.div`
  padding: 20px;
  padding-top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 99%;
  max-width: 800px;
  margin: 10px auto 20px;
  background: white;
  border: 1px solid #000;
  border-radius: 9px;
  padding: 28px 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0 0 12px;
`;

const Message = styled.p`
  color: #444;
  line-height: 1.5;
  margin: 0 0 20px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: var(--primary);
  text-decoration: underline;
`;

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 24px;
  border: none;
  background: var(--primary);
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: var(--error);
  margin: 0 0 16px;
`;

export default function VerifyEmail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const verifyEmail = useAuthStore(state => state.verifyEmail);
  const resendVerificationEmail = useAuthStore(state => state.resendVerificationEmail);
  const authStatus = useAuthStore(state => state.authStatus);
  const [status, setStatus] = useState('loading'); // loading | verified | already | error
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setStatus('error');
        setMessage(t('This verification link is invalid or has expired. Please request a new one.'));
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (cancelled) return;
        if (result.code === 'ALREADY_VERIFIED') {
          setStatus('already');
        } else {
          setStatus('verified');
        }
        setMessage(result.message || t("You're verified!"));
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          error.message ||
            t('This verification link is invalid or has expired. Please request a new one.')
        );
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token, verifyEmail, t]);

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');
    try {
      const result = await resendVerificationEmail();
      setResendMessage(result.message || t('Verification email sent. Please check your inbox.'));
    } catch (error) {
      setResendMessage(error.message || t('Unable to send verification email. Please try again later.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <OuterContainer>
      <Card>
        {status === 'loading' && (
          <>
            <Title>{t('Verifying your email...')}</Title>
            <Spinner size="40px" />
          </>
        )}

        {status === 'verified' && (
          <>
            <Title>{t("You're verified!")}</Title>
            <Message>{message}</Message>
            <StyledLink to="/">{t('Back to Home')}</StyledLink>
          </>
        )}

        {status === 'already' && (
          <>
            <Title>{t('Already verified')}</Title>
            <Message>{t('Your email is already verified.')}</Message>
            <StyledLink to="/">{t('Back to Home')}</StyledLink>
          </>
        )}

        {status === 'error' && (
          <>
            <Title>{t('Verification failed')}</Title>
            <ErrorText>{message}</ErrorText>
            <Actions>
              {authStatus.isLoggedIn ? (
                <>
                  <Button type="button" onClick={handleResend} disabled={isResending}>
                    {isResending ? t('Sending...') : t('Resend verification email')}
                  </Button>
                  {resendMessage && <Message>{resendMessage}</Message>}
                </>
              ) : (
                <Message>
                  {t('Please log in to request a new verification email.')}{' '}
                  <StyledLink to="/login">{t('Log In')}</StyledLink>
                </Message>
              )}
              <StyledLink to="/">{t('Back to Home')}</StyledLink>
            </Actions>
          </>
        )}
      </Card>
    </OuterContainer>
  );
}
