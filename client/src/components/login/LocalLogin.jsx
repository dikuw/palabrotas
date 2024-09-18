import React, { useRef }  from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { InvisibleActionButton, VisibleActionButton } from '../shared/index.js';

const StyledWrapperDiv = styled.div`
  max-width: 1200px;
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

export default function LocalLogin(props) {
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const forgotEmailRef = useRef(null);
  const warningRef = useRef(null);

  const resetValidation = () => {
    emailRef.current.style.background = "#fff";
    passwordRef.current.style.background = "#fff";
    forgotEmailRef.current.style.background = "#fff";
    warningRef.current.innerHTML = "";
    props.resetPasswordIncorrect();
  }

  const validateForm = () => {
    let passVal = true;
    // TODO Validate email address for format using a library
    // **  📧 📧 📧  **
    if (!emailRef.current.value) {
      emailRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Email is required";
      passVal = false;
    }
    if (!passwordRef.current.value) {
      passwordRef.current.style.background = "#ffc2c2";
      warningRef.current.innerHTML = "Password is required";
      passVal = false;
    }
    return passVal;
  }

  const loginClick = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const user = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      props.loginUser(user);
      event.currentTarget.reset();
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
        <input name="email" ref={emailRef} type="text" placeholder={"Email"} onFocus={resetValidation} />
        <input name="password" ref={passwordRef} type="password" placeholder={"Password"} onFocus={resetValidation} />
        <VisibleActionButton type="submit" buttonLabel={"Log in"} />
      </form>
      <StyledWarningDiv ref={warningRef}></StyledWarningDiv>
      {props.isPasswordIncorrect && <StyledWarningDiv>{"Email or password is incorrect. Please try again"}</StyledWarningDiv>}
      <div>{"Forgot your password"}?</div>
      <form onSubmit={forgotClick}>
        <input name="forgotEmail" ref={forgotEmailRef} type="text" placeholder={"Email"}  />
        <VisibleActionButton type="submit" buttonLabel={"Send a Reset"} />
      </form>
      <InvisibleActionButton clickHandler={() => handleClick('/register')} buttonLabel={"No account? Register here!"} />
    </StyledWrapperDiv>
  )
};