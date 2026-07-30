import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';

const OuterContainer = styled.div`
  padding: 20px;
  padding-top: 0;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormWrapper = styled.div`
  position: relative;
  width: 99%;
  max-width: 800px;
  margin: 10px auto 20px;
  z-index: 1;
`;

const FormContainer = styled.form`
  width: 100%;
  background-color: white;
  border-radius: 9px;
  border: 1px solid #000;
  padding: 20px;
  position: relative;
  z-index: 2;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--text);
  margin-bottom: 12px;
  text-align: center;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 0 0 20px;
  line-height: 1.4;
`;

const Input = styled.input`
  background-color: #fff;
  color: #000000;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 24px;
  font-size: 16px;
  border: 2px solid ${props => (props.$hasError ? 'var(--error)' : 'var(--secondary)')};
  height: 55px;
  width: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: #666666;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 15px;
  border-radius: 24px;
  border: ${props => (props.$primary ? 'none' : '1px dashed #000')};
  background-color: ${props => (props.$primary ? 'var(--primary)' : 'white')};
  color: ${props => (props.$primary ? 'white' : 'var(--text)')};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: var(--error);
  font-size: 14px;
  margin-bottom: 10px;
`;

const SuccessText = styled.div`
  color: #2e7d32;
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 1.4;
`;

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const requestPasswordReset = useAuthStore(state => state.requestPasswordReset);
  const addNotification = useNotificationStore(state => state.addNotification);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = t('Please provide your email.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = t('Please provide a valid email.');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmittedMessage('');
    try {
      const result = await requestPasswordReset(email.trim());
      const message =
        result.message ||
        t('If an account exists with that email, a reset link has been sent.');
      setSubmittedMessage(message);
      addNotification(message, 'success');
    } catch (error) {
      const message = error.message || t('Unable to send reset email. Please try again.');
      setErrors({ general: message });
      addNotification(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OuterContainer>
      <FormWrapper>
        <FormContainer onSubmit={handleSubmit}>
          <Title>{t('Forgot your password')}</Title>
          <Subtitle>
            {t('Enter your email and we will send you a link to reset your password.')}
          </Subtitle>

          <Input
            name="email"
            type="email"
            placeholder={t('Email')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: '', general: '' }));
              setSubmittedMessage('');
            }}
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
          {submittedMessage && <SuccessText>{submittedMessage}</SuccessText>}
          {errors.general && <ErrorText>{errors.general}</ErrorText>}

          <ButtonContainer>
            <Button type="submit" $primary disabled={isSubmitting}>
              {isSubmitting ? t('Sending...') : t('Send reset link')}
            </Button>
            <Button type="button" onClick={() => navigate('/login')}>
              {t('Back to Log In')}
            </Button>
          </ButtonContainer>
        </FormContainer>
      </FormWrapper>
    </OuterContainer>
  );
}
