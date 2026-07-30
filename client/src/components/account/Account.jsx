import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useContentStore } from '../../store/content';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';

import Banner from '../header/Banner';
import AccountGrid from './AccountGrid';
import Streak from './Streak';
import Spinner from '../shared/Spinner';

const StyledWrapperDiv = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 4px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100px;
`;

const VerificationCard = styled.div`
  background: #fff8e6;
  border: 1px solid #f0d78c;
  border-radius: 9px;
  padding: 16px;
  margin-bottom: 20px;
`;

const VerificationTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const VerificationText = styled.p`
  margin: 0 0 12px;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const ResendButton = styled.button`
  padding: 8px 14px;
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

const StatusText = styled.p`
  margin: 10px 0 0;
  font-size: 0.9rem;
`;

export default function Account() {
  const { t } = useTranslation();
  const { getContentsByUserId } = useContentStore();
  const { authStatus, resendVerificationEmail } = useAuthStore();
  const { getCurrentStreak, getLongestStreak } = useUserStore();
  const [userContents, setUserContents] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (authStatus.isLoggedIn && authStatus.user) {
        setIsLoading(true);
        setIsStreakLoading(true);

        try {
          const contents = await getContentsByUserId(authStatus.user._id);
          setUserContents(contents);
          setIsLoading(false);

          const [currentStreakData, longestStreakData] = await Promise.all([
            getCurrentStreak(authStatus.user._id),
            getLongestStreak(authStatus.user._id)
          ]);

          setCurrentStreak(currentStreakData.streak || 0);
          setLongestStreak(longestStreakData.streak || 0);
          setIsStreakLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
          setIsStreakLoading(false);
        }
      }
    }

    fetchData();
  }, [authStatus.isLoggedIn, authStatus.user, getContentsByUserId, getCurrentStreak, getLongestStreak]);

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

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }

  return (
    <StyledWrapperDiv>
      {authStatus.user.emailVerified === false && (
        <VerificationCard>
          <VerificationTitle>{t('Email not verified')}</VerificationTitle>
          <VerificationText>
            {t('Please verify your email to unlock subscriptions and paid lessons.')}
          </VerificationText>
          <ResendButton type="button" onClick={handleResend} disabled={isResending}>
            {isResending ? t('Sending...') : t('Resend verification email')}
          </ResendButton>
          {resendMessage && <StatusText>{resendMessage}</StatusText>}
        </VerificationCard>
      )}

      <Streak
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        isLoading={isStreakLoading}
      />

      <Banner bannerString={t("Your Content")} />

      {isLoading ? (
        <SpinnerContainer>
          <Spinner size="40px" />
        </SpinnerContainer>
      ) : (
        <AccountGrid contents={userContents} />
      )}
    </StyledWrapperDiv>
  )
};
