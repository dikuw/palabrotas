import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';

import { countries } from '../shared/countries';

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

const StyledSelect = styled.select`
  margin: 0.25rem;
  padding: 10px;
  font-size: 1rem;
  background-color: ${props => props.$hasError ? 'var(--warning)' : 'var(--almostWhite)'};
  color: ${props => props.$hasError ? 'red' : 'inherit'};
  border: 2px solid ;
  border-radius: 0; 
  appearance: none;
  // Add a custom dropdown arrow
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23000000' d='M0 0l4 4 4-4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  &:invalid {
    color: #757575; // This color should match your input placeholder color
  }

  option {
    color: inherit;
  }

  option:first-of-type {
    color: #757575; // This color should match your input placeholder color
  }
`;



export default function AddContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { addContent } = useContentStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    hint1: "",
    hint2: "",
    hint3: "",
    exampleSentence: "",
    owner: authStatus.user ? authStatus.user._id : "66f97a0ef1de0db4e4c254eb",
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
    if (!formData.country) newErrors.country = t("Please select a country.");
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
        <StyledSelect
          name="country"
          value={formData.country}
          onChange={handleChange}
          $hasError={!!errors.country}
        >
          <option value="" disabled hidden>{t("Select a country")}</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {t(country.name)}
            </option>
          ))}
        </StyledSelect>
        <StyledInput
          name="hint1"
          type="text"
          placeholder={errors.hint1 || t("First hint")}
          value={errors.hint1 ? "" : formData.hint1}
          onChange={handleChange}
          $hasError={!!errors.hint1}
        />
        <StyledInput
          name="hint2"
          type="text"
          placeholder={errors.hint2 || t("Second hint")}
          value={errors.hint2 ? "" : formData.hint2}
          onChange={handleChange}
          $hasError={!!errors.hint2}
        />
        <StyledInput
          name="hint3"
          type="text"
          placeholder={errors.hint3 || t("Third hint")}
          value={errors.hint3 ? "" : formData.hint3}
          onChange={handleChange}
          $hasError={!!errors.hint3}
        />
        <StyledInput
          name="exampleSentence"
          type="text"
          placeholder={errors.exampleSentence || t("Example sentence")}
          value={errors.exampleSentence ? "" : formData.exampleSentence}
          onChange={handleChange}
          $hasError={!!errors.exampleSentence}
        />
        <VisibleActionButton type="submit" buttonLabel={t("Add Content")} />
      </form>
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
    </StyledWrapperDiv>
  );
}