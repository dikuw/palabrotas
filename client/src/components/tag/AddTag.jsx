import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useTagStore } from '../../store/tag';
import { useNotificationStore } from '../../store/notification';

import { VisibleActionButton } from '../shared';

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

export default function AddTag() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { MAX_TAG_LENGTH, addTag } = useTagStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    name: "",
    owner: authStatus.user?._id
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("Please enter a name.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    if (!authStatus.isLoggedIn || !authStatus.user?._id) {
      addNotification(t('Please log in to add a tag'), 'info');
      return;
    }
    if (validateForm()) {
      try {
        const tagData = {
          ...formData,
          owner: authStatus.user._id
        };

        const result = await addTag(tagData);
        if (result) {
          navigate("/");
          addNotification(t('Added successfully'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Adding tag failed. Please try again.') });
      }
    }
  };

  return (
    <StyledWrapperDiv>
      <form onSubmit={formSubmit}>
        <StyledInput
          name="name"
          type="text"
          placeholder={errors.name || t("tag")}
          value={errors.name ? "" : formData.name}
          onChange={handleChange}
          $hasError={!!errors.name}
          maxLength={MAX_TAG_LENGTH}
        />
        <VisibleActionButton type="submit" buttonLabel={t("Add Tag")} />
      </form>
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
    </StyledWrapperDiv>
  );
};
