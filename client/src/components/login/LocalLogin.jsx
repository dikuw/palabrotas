import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InvisibleActionButton, VisibleActionButton } from '../shared/index.js';
import { useAuthStore } from '../../store/auth';
import { useNotificationStore } from '../../store/notification';
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
    textarea {
      width: 100%;
    }
    button {
      border: 0;
    }
  }
`;

const StyledWarningDiv = styled.div`
  text-align: center;
  padding: 0vw 3vw;
  color: red;
  font-weight: 600;
`;

const StyledInput = styled.input`
  background-color: ${props => props.$hasError ? 'var(--warning)' : 'var(--almostWhite)'};
  color: ${props => props.$hasError ? 'red' : 'inherit'};
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
    <StyledWrapperDiv>
      <form onSubmit={loginClick}>
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
        <VisibleActionButton type="submit" buttonLabel={t("Log in")} />
      </form>
      {/* <div>{"Forgot your password"}?</div>
      <form onSubmit={forgotClick}>
        <input name="forgotEmail" type="text" placeholder={"Email"}  />
        <VisibleActionButton type="submit" buttonLabel={"Send a Reset"} />
      </form> */}
      <InvisibleActionButton clickHandler={() => handleClick('/register')} buttonLabel={t("No account? Register here!") } />
    </StyledWrapperDiv>
  );
};