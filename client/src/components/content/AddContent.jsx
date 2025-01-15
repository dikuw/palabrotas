import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';
import { countries } from '../shared/countries';

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
  z-index: 4;
`;

const Input = styled.input`
  background-color: #FFF;
  color: #000000;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 24px;
  font-size: 16px;
  border: 2px solid ${props => props.$hasError ? 'var(--error)' : 'var(--secondary)'};
  height: 55px;
  width: 100%;

  &::placeholder {
    color: #666666;
  }
`;

const Select = styled.select`
  background-color: #FFF;
  color: #000000;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 20px;
  font-size: 16px;
  border: 2px solid ${props => props.$hasError ? 'var(--error)' : 'var(--secondary)'};
  height: 65px;
  width: 100%;
  appearance: none;

  &::placeholder {
    color: #666666;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 15px;
  border-radius: 24px;
  border: ${props => props.$primary ? 'none' : '1px dashed #000'};
  background-color: ${props => props.$primary ? 'var(--primary)' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--text)'};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
  }
`;

const ErrorText = styled.div`
  color: var(--error);
  font-size: 14px;
  margin-bottom: 10px;
`;

const BackgroundCard = styled.div`
  position: absolute;
  width: 100%;
  height: 60px;
  border-radius: 9px;
  border: 1px solid #000;
  background-color: var(--primary);
  z-index: ${props => 3 - props.$index};
  bottom: ${props => -5 - (props.$index * 5)}px;
  left: 0;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--text);
  margin-bottom: 20px;
  text-align: center;
`;

export default function AddContent() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authStatus } = useAuthStore();
  const { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, addContent } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    hint: "",
    exampleSentence: "",
    owner: authStatus.user ? authStatus.user._id : "66f97a0ef1de0db4e4c254eb",
    author: authStatus.user ? authStatus.user.name : "Anonymous",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.author) newErrors.author = t("Please enter an author.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await addContent(formData);
        if (result) {
          navigate("/");
          addNotification('Added successfully', 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Adding content failed. Please try again.') });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <OuterContainer>
      <FormWrapper>
        <FormContainer onSubmit={formSubmit}>
          <Title>{t("Add Content")}</Title>
          
          <Input
            name="title"
            type="text"
            placeholder={t("Title")}
            value={formData.title}
            onChange={handleChange}
            $hasError={!!errors.title}
            maxLength={MAX_TITLE_LENGTH}
          />
          {errors.title && <ErrorText>{errors.title}</ErrorText>}

          <Input
            name="description"
            type="text"
            placeholder={t("Description")}
            value={formData.description}
            onChange={handleChange}
            $hasError={!!errors.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          {errors.description && <ErrorText>{errors.description}</ErrorText>}

          <Select
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
          </Select>
          {errors.country && <ErrorText>{errors.country}</ErrorText>}

          <Input
            name="author"
            type="text"
            placeholder={t("Author")}
            value={formData.author}
            onChange={handleChange}
            $hasError={!!errors.author}
          />
          {errors.author && <ErrorText>{errors.author}</ErrorText>}

          <Input
            name="hint"
            type="text"
            placeholder={t("Hint (optional)")}
            value={formData.hint}
            onChange={handleChange}
          />

          <Input
            name="exampleSentence"
            type="text"
            placeholder={t("Example sentence (optional)")}
            value={formData.exampleSentence}
            onChange={handleChange}
          />

          <ButtonContainer>
            <Button type="submit" $primary disabled={isSubmitting}>
              {isSubmitting ? t("Adding...") : t("Add")}
            </Button>
            <Button type="button" onClick={() => navigate("/")}>
              {t("Cancel")}
            </Button>
          </ButtonContainer>

          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </FormContainer>
        {[0, 1, 2].map((index) => (
          <BackgroundCard key={index} $index={index} />
        ))}
      </FormWrapper>
    </OuterContainer>
  );
}