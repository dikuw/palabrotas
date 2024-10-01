import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useTranslation } from "react-i18next";
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

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

export default function EditItemForm(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { contents, getContents, updateContent, deleteContent } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
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
      });
    }
  }, [id, contents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setIsDirty(true);
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
        <VisibleActionButton type="submit" disabled={!isDirty} buttonLabel={t("Update Content")} />
      </form>
      <InvisibleActionButton clickHandler={() => handleDelete()} buttonLabel={t("Delete Content")} />
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
    </StyledWrapperDiv>
  );
}