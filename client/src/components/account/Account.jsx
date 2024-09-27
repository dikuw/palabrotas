import React, { useState } from 'react';
import styled from 'styled-components';
import { VisibleActionButton } from '../shared/index';
import { useAuthStore } from '../../store/auth';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';

const StyledWrapperDiv = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 4px;
`;

const StyledForm = styled.form`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  input, select {
    flex-basis: 100%;
    margin: 0.25rem;
    padding: 10px;
    font-size: 1rem;
  }
  input:focus, textarea:focus, select:focus {
    outline: 0;
    background: #fef2de;
  }
  textarea {
    width: 100%;
  }
  button {
    border: 0;
  }
`;

const StyledFormRowDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1vw;
`;

const StyledLabel = styled.label`
  flex-basis: 10%;
  @media (max-width: 768px) {
    flex-basis: 20%;
  }
`;

const StyledInput = styled.input`
  background-color: ${props => props.$hasError ? 'var(--warning)' : 'var(--almostWhite)'};
  color: ${props => props.$hasError ? 'red' : 'inherit'};
`;

export default function Account() {
  const { t } = useTranslation();
  const { authStatus, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.password) newErrors.password = t("Password cannot be blank.");
    if (!formData.confirmPassword) newErrors.confirmPassword = t("Confirm Password cannot be blank.");
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = t("Passwords do not match.");
      newErrors.confirmPassword = t("Passwords do not match.");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateClick = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await updateUser(formData);
        if (result.user.email) {
          navigate("/");
        }
      } catch (error) {
        setErrors({ general: error.message || t('Update failed. Please try again.') });
      }
    }
  };
  
  if (!authStatus.isLoggedIn) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }
  return (
    <StyledWrapperDiv>
      <StyledForm onSubmit={updateClick}>
      <StyledFormRowDiv>
          <StyledLabel htmlFor="name">{t("Name")}: </StyledLabel>
          <StyledInput
            name="name"
            type="text"
            placeholder={errors.name || t("Name")}
            value={errors.name ? "" : formData.name}
            onChange={handleChange}
            $hasError={!!errors.name}
          />
        </StyledFormRowDiv>
        <StyledFormRowDiv>
          <StyledLabel htmlFor="email">{t("Email")}: </StyledLabel>
          <StyledInput
            name="email"
            type="text"
            placeholder={errors.email || t("Email")}
            value={errors.email ? "" : formData.email}
            onChange={handleChange}
            $hasError={!!errors.email}
          />
        </StyledFormRowDiv>
        <VisibleActionButton type="submit" buttonLabel={t("Update")} />
      </StyledForm>
      <div>{t("Your Content")}</div>
      {/* <Orders userOrders={props.userOrders} /> */}
    </StyledWrapperDiv>
  )
};
