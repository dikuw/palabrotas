import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { VisibleActionButton } from '../shared/index';
import { useFeedbackStore } from '../../store/feedback';
import { useNotificationStore } from '../../store/notification';

const StyledWrapperDiv = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 4px;
  form {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    input, select {
      margin: 0.25rem;
      padding: 10px;
      font-size: 1rem;
    }
    input:focus, textarea:focus, select:focus {
      outline: 0;
      background: #fef2de;
    }
    button {
      border: 0;
    }
  }
`;

const StyledInput = styled.input`
  background-color: ${props => props.$hasError ? 'var(--warning)' : 'var(--almostWhite)'};
  color: ${props => props.$hasError ? 'red' : 'inherit'};
`;

export default function Feedback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addFeedback } = useFeedbackStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("Please provide your name.");
    if (!formData.email) newErrors.email = t("Please provide your email.");
    if (!formData.message) newErrors.message = t("Message cannot be blank.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await addFeedback(formData);
        if (result.success) {
          navigate("/");
          addNotification(t('Feedback submitted successfully!'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Feedback submission failed. Please try again.') });
        addNotification(t('Feedback submission failed. Please try again.'), 'error');
      }
    }
  };

  return (
    <StyledWrapperDiv>
      <form onSubmit={handleSubmit}>
        <StyledInput
          name="name"
          type="text"
          placeholder={errors.name || t("Name")}
          value={errors.name ? "" : formData.name}
          onChange={handleChange}
          $hasError={!!errors.name}
        />
        <StyledInput
          name="email"
          type="email"
          placeholder={errors.email || t("Email")}
          value={errors.email ? "" : formData.email}
          onChange={handleChange}
          $hasError={!!errors.email}
        />
        <StyledInput
          name="message"
          type="textarea"
          placeholder={errors.message || t("Message")}
          value={errors.message ? "" : formData.message}
          onChange={handleChange}
          $hasError={!!errors.message}
        />
        <VisibleActionButton type="submit" buttonLabel={t("Submit")} />
      </form>
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
    </StyledWrapperDiv>
  );
}
