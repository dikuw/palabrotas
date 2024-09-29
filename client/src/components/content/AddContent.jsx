import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';

import VisibleActionButton from '../shared/VisibleActionButton';  

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

export default function AddContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { addContent } = useContentStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    owner: authStatus.user ? authStatus.user.id : "66f97a0ef1de0db4e4c254eb",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = t("Please enter a title.");
    if (!formData.description) newErrors.description = t("Please enter a description.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await addContent(formData);
        if (result) {
          navigate("/");
        }
      } catch (error) {
        setErrors({ general: error.message || t('Adding content failed. Please try again.') });
      }
    }
  };

  return (
    <StyledWrapperDiv>
      <form onSubmit={formSubmit}>
        <StyledInput
          name="title"
          type="text"
          placeholder={errors.title || t("title")}
          value={errors.title ? "" : formData.title}
          onChange={handleChange}
          $hasError={!!errors.title}
        />
        <StyledInput
          name="description"
          type="text"
          placeholder={errors.description || t("description")}
          value={errors.description ? "" : formData.description}
          onChange={handleChange}
          $hasError={!!errors.description}
        />
        <VisibleActionButton type="submit" buttonLabel={t("Add Content")} />
      </form>
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
    </StyledWrapperDiv>
  );
}