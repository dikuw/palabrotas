import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { InvisibleActionButton, VisibleActionButton } from '../shared/index.js';
import GoogleLogin from './GoogleLogin';

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

const OrDivider = styled.div`
  text-align: center;
  margin: 16px 0;
  color: var(--darkGrey);
  font-size: 14px;
  position: relative;
  width: 100%;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: var(--lightGrey);
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

const GoogleContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export default function LocalLogin(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser } = useAuthStore();
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
    if (!formData.email) newErrors.email = t("Please provide your email.");
    if (!formData.password) newErrors.password = t("Password cannot be blank.");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginClick = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const result = await loginUser(formData);
        if (result.user.email) {
          navigate("/");
          addNotification(t('Logged in successfully!'), 'success');
        }
      } catch (error) {
        setErrors({ general: error.message || t('Login failed. Please try again.') });
        addNotification(t('Login failed. Please try again.'), 'error');
      }
    }
  };
  
  const forgotClick = (event) => {
    event.preventDefault();
    //  TODO validate forgot password form
    const user = {
      email: forgotEmailRef.current.value,
    };
    props.forgotUser(user);
    event.currentTarget.reset();
  };

  const handleClick = (link) => {
    navigate(link);
  };

  return (
    <OuterContainer>
      <FormWrapper>
        <FormContainer onSubmit={loginClick}>
          <Title>{t("Log in")}</Title>
          
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

          <ButtonContainer>
            <Button type="submit" $primary>
              {t("Log in")}
            </Button>

            <Button type="button" onClick={() => handleClick('/register')}>
              {t("No account? Register here!")}
            </Button>
          </ButtonContainer>

          <OrDivider>{t("or")}</OrDivider>
          
          <GoogleContainer>
            <GoogleLogin />
          </GoogleContainer>
          
          {errors.general && <ErrorText>{errors.general}</ErrorText>}
        </FormContainer>
      </FormWrapper>
    </OuterContainer>
  );
};