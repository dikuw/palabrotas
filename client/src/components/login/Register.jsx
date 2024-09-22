import React, { useRef }  from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { InvisibleActionButton, VisibleActionButton } from '../shared/index';
import { useUserStore } from '../../store/user';

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

const StyledWarningDiv = styled.div`
  text-align: center;
  padding: 0vw 3vw;
  color: red;
  font-weight: 600;
`;

export default function Register(props) {
  const navigate = useNavigate();

  const { registerUser } = useUserStore();
  
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const warningRef = useRef(null);

  const resetValidation = () => {
    nameRef.current.style.background = "#fff";
    emailRef.current.style.background = "#fff";
    passwordRef.current.style.background = "#fff";
    confirmPasswordRef.current.style.background = "#fff";
    warningRef.current.innerHTML = "";
  }

  const validateForm = () => {
    let passVal = true;
    if (!passwordRef.current.value) {
      passwordRef.current.style.background = "#ffc2c2";
      confirmPasswordRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Password cannot be blank! Please try again.";
      passVal = false;
    }
    if (!confirmPasswordRef.current.value) {
      passwordRef.current.style.background = "#ffc2c2";
      confirmPasswordRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Confirm Password cannot be blank! Please try again.";
      passVal = false;
    }
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      passwordRef.current.style.background = "#ffc2c2";
      confirmPasswordRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Passwords do not match! Please try again.";
      passVal = false;
    }
    if (!nameRef.current.value) {
      nameRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Please provide your name.";
      passVal = false;
    }
    // TODO Validate email address for format using a library
    // **  📧 📧 📧  **
    if (!emailRef.current.value) {
      emailRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Please provide your email.";
      passVal = false;
    }
    return passVal;
  }

  const registerClick = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const user = {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        confirmPassword: confirmPasswordRef.current.value,
      };
      await registerUser(user).then((res) => {
        if (res.email) {
          navigate("/");
      } else {
        //  TODO Surface errors to user (e.g. account is already registered)
          console.log('error', res);
        }
      });
    }
  };

  const goBack = () => {
    navigate("/login");
  };

  return (
    <StyledWrapperDiv>
      <form onSubmit={registerClick}>
        <input name="name" ref={nameRef} type="text" placeholder={"Name"} onFocus={resetValidation} />
        <input name="email" ref={emailRef} type="text" placeholder={"Email"} onFocus={resetValidation} />
        <input name="password" ref={passwordRef} type="password" placeholder={"Password"} onFocus={resetValidation} />
        <input name="confirmPassword" ref={confirmPasswordRef} type="password" placeholder={"Confirm Password"} onFocus={resetValidation} />
        <VisibleActionButton type="submit" buttonLabel={"Register"} />
      </form>
      <StyledWarningDiv ref={warningRef}></StyledWarningDiv>
      <InvisibleActionButton clickHandler={goBack} buttonLabel={"Back to Log In"} />
    </StyledWrapperDiv>
  )
};
