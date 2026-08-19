import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContentStore } from '../../store/content';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';
import {
  canStartSubscription,
  EMAIL_NOT_VERIFIED_MESSAGE,
  hasActiveSubscription,
} from '../../utils/subscriptionGate';
import { useNotificationStore } from '../../store/notification';

import Banner from '../header/Banner';
import AccountGrid from './AccountGrid';
import Streak from './Streak';
import Spinner from '../shared/Spinner';
import DeleteAccountModal from './DeleteAccountModal';

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

const SubscriptionCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 9px;
  padding: 16px;
  margin-bottom: 20px;
`;

const SubscriptionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const SubscriptionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
`;

const PrimaryButton = styled.button`
  padding: 8px 16px;
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

const DangerZone = styled.div`
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #ddd;
`;

const DangerTitle = styled.h2`
  font-size: 1.1rem;
  margin: 0 0 8px;
  color: #c0392b;
`;

const DangerText = styled.p`
  margin: 0 0 14px;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const DeleteAccountButton = styled.button`
  padding: 8px 16px;
  border-radius: 24px;
  border: 1px solid #c0392b;
  background: white;
  color: #c0392b;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #c0392b;
    color: white;
  }
`;

function subscriptionLabel(status, t) {
  switch (status) {
    case 'active':
      return t('Active');
    case 'past_due':
      return t('Past due');
    case 'canceled':
      return t('Canceled');
    case 'incomplete':
      return t('Incomplete');
    default:
      return t('None');
  }
}

export default function Account() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getContentsByUserId } = useContentStore();
  const {
    authStatus,
    resendVerificationEmail,
    deleteAccount,
    startCheckout,
    openBillingPortal,
    getCurrentUser,
  } = useAuthStore();
  const { getCurrentStreak, getLongestStreak } = useUserStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [userContents, setUserContents] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [billingMessage, setBillingMessage] = useState('');
  const [isBillingLoading, setIsBillingLoading] = useState(false);

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

  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (!checkout) return;

    if (checkout === 'success') {
      addNotification(t('Thank you for subscribing!'), 'success');
      setBillingMessage(t('Your subscription is being activated. Paid lessons unlock in a moment.'));
      // Webhook may land slightly after redirect — refresh a few times
      getCurrentUser?.();
      const t1 = setTimeout(() => getCurrentUser?.(), 1500);
      const t2 = setTimeout(() => getCurrentUser?.(), 4000);
      const next = new URLSearchParams(searchParams);
      next.delete('checkout');
      setSearchParams(next, { replace: true });
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    if (checkout === 'cancel') {
      addNotification(t('Checkout canceled.'), 'info');
      setBillingMessage(t('Checkout canceled.'));
    }

    const next = new URLSearchParams(searchParams);
    next.delete('checkout');
    setSearchParams(next, { replace: true });
    return undefined;
  }, [searchParams, setSearchParams, getCurrentUser, t, addNotification]);

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

  const handleSubscribe = async (plan) => {
    setBillingMessage('');
    if (!canStartSubscription(authStatus.user)) {
      setBillingMessage(t(EMAIL_NOT_VERIFIED_MESSAGE));
      return;
    }
    setIsBillingLoading(true);
    try {
      await startCheckout(plan);
    } catch (error) {
      setBillingMessage(error.message || t('Unable to start checkout. Please try again later.'));
      setIsBillingLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setBillingMessage('');
    setIsBillingLoading(true);
    try {
      await openBillingPortal();
    } catch (error) {
      setBillingMessage(error.message || t('Unable to open billing portal. Please try again later.'));
      setIsBillingLoading(false);
    }
  };

  const handleDeleteConfirm = async (confirmation) => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(confirmation);
      navigate('/account-deleted', { replace: true });
    } catch (error) {
      setDeleteError(error.message || t('Unable to delete account. Please try again later.'));
      setIsDeleting(false);
    }
  };

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }

  const subscribed = hasActiveSubscription(authStatus.user);
  const status = authStatus.user.subscriptionStatus || 'none';

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

      <SubscriptionCard>
        <SubscriptionTitle>{t('Subscription')}</SubscriptionTitle>
        <VerificationText>
          {t('Status')}: {subscriptionLabel(status, t)}
        </VerificationText>
        <VerificationText>
          {t('Lessons 1–15 are free. An active subscription unlocks lessons 16+.')}
        </VerificationText>
        <SubscriptionActions>
          {!subscribed && (
            <>
              <PrimaryButton
                type="button"
                onClick={() => handleSubscribe('monthly')}
                disabled={isBillingLoading}
              >
                {isBillingLoading ? t('Loading...') : t('Subscribe monthly')}
              </PrimaryButton>
              <PrimaryButton
                type="button"
                onClick={() => handleSubscribe('yearly')}
                disabled={isBillingLoading}
              >
                {isBillingLoading ? t('Loading...') : t('Subscribe yearly')}
              </PrimaryButton>
            </>
          )}
          {(authStatus.user.hasStripeCustomer || subscribed || status === 'past_due' || status === 'canceled') && (
            <PrimaryButton
              type="button"
              onClick={handleManageBilling}
              disabled={isBillingLoading}
            >
              {isBillingLoading ? t('Loading...') : t('Manage subscription')}
            </PrimaryButton>
          )}
        </SubscriptionActions>
        {subscribed && (
          <VerificationText style={{ marginTop: 12 }}>
            {t('Use Manage subscription to update payment details or cancel.')}
          </VerificationText>
        )}
        {billingMessage && <StatusText>{billingMessage}</StatusText>}
      </SubscriptionCard>

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

      <DangerZone>
        <DangerTitle>{t('Delete Account')}</DangerTitle>
        <DangerText>
          {t('Permanently delete your account and anonymize your personal data. This cannot be undone.')}
        </DangerText>
        <DeleteAccountButton type="button" onClick={() => {
          setDeleteError('');
          setShowDeleteModal(true);
        }}>
          {t('Delete Account')}
        </DeleteAccountButton>
      </DangerZone>

      {showDeleteModal && (
        <DeleteAccountModal
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={() => {
            if (!isDeleting) setShowDeleteModal(false);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </StyledWrapperDiv>
  )
};
