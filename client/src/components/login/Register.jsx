import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { InvisibleActionButton, VisibleActionButton } from '../shared/index';
import { useAuthStore } from '../../store/auth';

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

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useAuthStore();
  
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

  const registerClick = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await registerUser(formData);
        if (result.user.email) {
          navigate("/");
        }
      } catch (error) {
        setErrors({ general: error.message || t('Registration failed. Please try again.') });
      }
    }
  };

  return (
    <StyledWrapperDiv>
      <form onSubmit={registerClick}>
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
          name="password"
          type="password"
          placeholder={errors.password || t("Password")}
          value={errors.password ? "" : formData.password}
          onChange={handleChange}
          $hasError={!!errors.password}
        />
        <StyledInput
          name="confirmPassword"
          type="password"
          placeholder={errors.confirmPassword || t("Confirm Password")}
          value={errors.confirmPassword ? "" : formData.confirmPassword}
          onChange={handleChange}
          $hasError={!!errors.confirmPassword}
        />
        <VisibleActionButton type="submit" buttonLabel={t("Register")} />
      </form>
      {errors.general && <div style={{ color: 'red' }}>{errors.general}</div>}
      <InvisibleActionButton clickHandler={() => navigate("/login")} buttonLabel={t("Back to Log In")} />
    </StyledWrapperDiv>
  );
};
