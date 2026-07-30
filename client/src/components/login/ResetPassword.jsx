import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  margin-bottom: 20px;
  text-align: center;
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

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const resetPassword = useAuthStore(state => state.resetPassword);
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', general: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!token) {
      newErrors.general = t('Password reset link is invalid or has expired. Please request a new one.');
    }
    if (!formData.password) {
      newErrors.password = t('Password cannot be blank.');
    } else if (formData.password.length < 8) {
      newErrors.password = t('Password must be at least 8 characters long.');
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('Confirm Password cannot be blank.');
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.password = t('Passwords do not match.');
      newErrors.confirmPassword = t('Passwords do not match.');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      addNotification(
        result.message || t('Password updated successfully. You can now log in.'),
        'success'
      );
      navigate('/login');
    } catch (error) {
      const message =
        error.message ||
        t('Password reset link is invalid or has expired. Please request a new one.');
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
          <Title>{t('Set new password')}</Title>

          {!token && (
            <ErrorText>
              {t('Password reset link is invalid or has expired. Please request a new one.')}
            </ErrorText>
          )}

          <Input
            name="password"
            type="password"
            placeholder={t('Password')}
            value={formData.password}
            onChange={handleChange}
            $hasError={!!errors.password}
            disabled={!token}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <Input
            name="confirmPassword"
            type="password"
            placeholder={t('Confirm Password')}
            value={formData.confirmPassword}
            onChange={handleChange}
            $hasError={!!errors.confirmPassword}
            disabled={!token}
          />
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          {errors.general && <ErrorText>{errors.general}</ErrorText>}

          <ButtonContainer>
            <Button type="submit" $primary disabled={isSubmitting || !token}>
              {isSubmitting ? t('Saving...') : t('Update password')}
            </Button>
            <Button type="button" onClick={() => navigate('/forgot-password')}>
              {t('Request a new reset link')}
            </Button>
          </ButtonContainer>
        </FormContainer>
      </FormWrapper>
    </OuterContainer>
  );
}
