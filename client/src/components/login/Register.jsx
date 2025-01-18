import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { InvisibleActionButton, VisibleActionButton } from '../shared/index';
import { useAuthStore } from '../../store/auth';
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

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerUser } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);
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
    if (!formData.password) {
      newErrors.password = t("Password cannot be blank.");
    } else if (formData.password.length < 8) {
      newErrors.password = t("Password must be at least 8 characters long.");
    }
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
          addNotification(t('Registration successful!'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Registration failed. Please try again.') });
        addNotification(t('Registration failed. Please try again.'), 'error');
      }
    }
  };

  return (
    <OuterContainer>
      <FormWrapper>
        <FormContainer onSubmit={registerClick}>
          <Title>{t("Register")}</Title>
          
          <Input
            name="name"
            type="text"
            placeholder={t("Name")}
            value={formData.name}
            onChange={handleChange}
            $hasError={!!errors.name}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}

          <Input
            name="email"
            type="email"
            placeholder={t("Email")}
            value={formData.email}
            onChange={handleChange}
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}

          <Input
            name="password"
            type="password"
            placeholder={t("Password")}
            value={formData.password}
            onChange={handleChange}
            $hasError={!!errors.password}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}

          <Input
            name="confirmPassword"
            type="password"
            placeholder={t("Confirm Password")}
            value={formData.confirmPassword}
            onChange={handleChange}
            $hasError={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}

          <ButtonContainer>
            <Button type="submit" $primary>
              {t("Register")}
            </Button>

            <Button type="button" onClick={() => navigate("/login")}>
              {t("Back to Log In")}
            </Button>
          </ButtonContainer>

          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </FormContainer>
      </FormWrapper>
    </OuterContainer>
  );
};
