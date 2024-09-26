import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { InvisibleActionButton, VisibleActionButton } from '../shared/index.js';
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
  const navigate = useNavigate();
  const { loginUser } = useAuthStore();

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
    if (!formData.email) newErrors.email = "Please provide your email.";
    if (!formData.password) newErrors.password = "Password cannot be blank.";
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
        }
      } catch (error) {
        setErrors({ general: error.message || 'Login failed. Please try again.' });
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
      <div>{"Log in"}</div>
      <form onSubmit={loginClick}>
        <StyledInput
          name="email"
          type="email"
          placeholder={errors.email || "Email"}
          value={errors.email ? "" : formData.email}
          onChange={handleChange}
          $hasError={!!errors.email}
        />
        <StyledInput
          name="password"
          type="password"
          placeholder={errors.password || "Password"}
          value={errors.password ? "" : formData.password}
          onChange={handleChange}
          $hasError={!!errors.password}
        />
        <VisibleActionButton type="submit" buttonLabel="Log in" />
      </form>
      <div>{"Forgot your password"}?</div>
      <form onSubmit={forgotClick}>
        <input name="forgotEmail" type="text" placeholder={"Email"}  />
        <VisibleActionButton type="submit" buttonLabel={"Send a Reset"} />
      </form>
      <InvisibleActionButton clickHandler={() => handleClick('/register')} buttonLabel={"No account? Register here!"} />
    </StyledWrapperDiv>
  );
};