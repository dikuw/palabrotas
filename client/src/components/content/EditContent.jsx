import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useTranslation } from "react-i18next";
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

import { countries } from '../shared/countries';

import VisibleActionButton from '../shared/VisibleActionButton';
import InvisibleActionButton from '../shared/InvisibleActionButton';  

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

export default function EditItemForm(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, contents, getContents, updateContent, deleteContent } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    country: "",
    hint: "",
    exampleSentence: "",
    author: "",
  });

  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const contentItem = contents.find(item => item._id === id);
    if (contentItem) {
      setFormData({
        id: contentItem._id,
        title: contentItem.title,
        description: contentItem.description,
        country: contentItem.country,
        hint: contentItem.hint || "",
        exampleSentence: contentItem.exampleSentence || "",
        author: contentItem.author || "",
      });
    }
  }, [id, contents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || "" }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setIsDirty(true);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title) newErrors.title = t("Please enter a title.");
    if (!formData.description) newErrors.description = t("Please enter a description.");
    if (!formData.country) newErrors.country = t("Please select a country.");
    if (!formData.author) newErrors.author = t("Please enter an author.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await updateContent(formData);
        if (result) {
          await getContents();
          setIsDirty(false);
          navigate('/');
          addNotification('Updated successfully', 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Updating content failed. Please try again.') });
      }
      setIsDirty(false);
    }
  };

  const handleDelete = async () => {  
    try {
      const result = await deleteContent(formData);
      if (result) {
        await getContents();
        navigate('/');
      }
    } catch (error) {
      setErrors({ general: error.message || t('Deleting content failed. Please try again.') });
    }
  };

  return (
    <StyledWrapperDiv>
      <form onSubmit={formSubmit}>
        <StyledInput
          name="title"
          type="text"
          placeholder={t("Title")}
          value={formData.title}
          onChange={handleChange}
          $hasError={!!errors.title}
          maxLength={MAX_TITLE_LENGTH}
        />
        <StyledInput
          name="description"
          type="text"
          placeholder={t("Description")}
          value={formData.description}
          onChange={handleChange}
          $hasError={!!errors.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
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
          name="author"
          type="text"
          placeholder={errors.author || t("Author")}
          value={errors.author ? "" : formData.author}
          onChange={handleChange}
          $hasError={!!errors.author}
        />
        <StyledInput
          name="hint"
          type="text"
          placeholder={t("Hint")}
          value={formData.hint}
          onChange={handleChange}
          $hasError={!!errors.hint}
        />
        <StyledInput
          name="exampleSentence"
          type="text"
          placeholder={t("Example sentence")}
          value={formData.exampleSentence}
          onChange={handleChange}
          $hasError={!!errors.exampleSentence}
        />
        <VisibleActionButton type="submit" disabled={!isDirty} buttonLabel={t("Update Content")} />
      </form>
      <InvisibleActionButton clickHandler={() => handleDelete()} buttonLabel={t("Delete Content")} />
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
    </StyledWrapperDiv>
  );
}