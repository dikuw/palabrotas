import React, { useState } from 'react';
import styled from 'styled-components';
import { VisibleActionButton } from '../shared/index';
import { useAuthStore } from '../../store/auth';
// import { NoPermissionDiv } from '../shared/index';

const StyledWrapperDiv = styled.div`
  max-width: 1200px;
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

const StyledButton = styled.button`
  font-size: 1.2em;
  text-transform: uppercase;
  font-weight: 400;
  font-style: normal;
  background: var(--rosaVieja);
  border-color: var(--rosaVieja);
  border-radius: 2px;
  border: 0;
  color: #ffffff;
  display: inline-block;
  height: 45px;
  letter-spacing: 1px;
  line-height: 45px;
  margin: 0.25rem;
  padding: 0 25px;
  transition: background-color 300ms ease-out;
  width: auto;
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

export default function Account(props) {
  const { updateUser } = useAuthStore();

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
    if (!formData.name) newErrors.name = "Please provide your name.";
    if (!formData.email) newErrors.email = "Please provide your email.";
    if (!formData.password) newErrors.password = "Password cannot be blank.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password cannot be blank.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Passwords do not match.";
      newErrors.confirmPassword = "Passwords do not match.";
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
        setErrors({ general: error.message || 'Update failed. Please try again.' });
      }
    }
  };
  
  // if (!props.isLoggedIn) {
  //   return <NoPermissionDiv divLabel={"Please log in to view this page"}></NoPermissionDiv>
  // }
  return (
    <StyledWrapperDiv>
      <div>{"Update Your Account"}</div>
      <StyledForm onSubmit={updateClick}>
      <StyledFormRowDiv>
          <StyledLabel htmlFor="name">{"Name"}: </StyledLabel>
          <StyledInput
            name="name"
            type="text"
            placeholder={errors.name || "Name"}
            value={errors.name ? "" : formData.name}
            onChange={handleChange}
            $hasError={!!errors.name}
          />
        </StyledFormRowDiv>
        <StyledFormRowDiv>
          <StyledLabel htmlFor="email">{"Email"}: </StyledLabel>
          <StyledInput
            name="email"
            type="text"
            placeholder={errors.email || "Email"}
            value={errors.email ? "" : formData.email}
            onChange={handleChange}
            $hasError={!!errors.email}
          />
        </StyledFormRowDiv>
        <VisibleActionButton type="submit" buttonLabel="Update" />
      </StyledForm>
      {/* <StyledWarningDiv ref={warningRef}></StyledWarningDiv> */}
      <div>{"Your Content"}</div>
      {/* <Orders userOrders={props.userOrders} /> */}
    </StyledWrapperDiv>
  )
};
