import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useContactStore } from '../../store/contact';
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

const TextArea = styled.textarea`
  background-color: #fff;
  color: #000000;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 24px;
  font-size: 16px;
  border: 2px solid ${props => (props.$hasError ? 'var(--error)' : 'var(--secondary)')};
  min-height: 160px;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;

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

export default function ContactForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sendContactMessage = useContactStore(state => state.sendContactMessage);
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('Please provide your name.');
    if (!formData.email.trim()) {
      newErrors.email = t('Please provide your email.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('Please provide a valid email.');
    }
    if (!formData.message.trim()) newErrors.message = t('Message cannot be blank.');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      addNotification(t('Message sent successfully!'), 'success');
      navigate('/');
    } catch (error) {
      const message = error.message || t('Failed to send message. Please try again.');
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
          <Title>{t('Contact')}</Title>

          <Input
            name="name"
            type="text"
            placeholder={t('Name')}
            value={formData.name}
            onChange={handleChange}
            $hasError={!!errors.name}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}

          <Input
            name="email"
            type="email"
            placeholder={t('Email')}
            value={formData.email}
            onChange={handleChange}
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}

          <TextArea
            name="message"
            placeholder={t('Message')}
            value={formData.message}
            onChange={handleChange}
            $hasError={!!errors.message}
          />
          {errors.message && <ErrorText>{errors.message}</ErrorText>}

          <ButtonContainer>
            <Button type="submit" $primary disabled={isSubmitting}>
              {isSubmitting ? t('Sending...') : t('Send')}
            </Button>
            <Button type="button" onClick={() => navigate('/')}>
              {t('Cancel')}
            </Button>
          </ButtonContainer>

          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </FormContainer>
      </FormWrapper>
    </OuterContainer>
  );
}
