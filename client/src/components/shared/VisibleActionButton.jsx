import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  font-size: 1.2em;
  text-transform: uppercase;
  font-weight: 400;
  font-style: normal;
  background: var(--primary);
  border-color: var(--primary);
  border-radius: 2px;
  border: 0;
  color: var(--buttonText);
  display: inline-block;
  height: 45px;
  letter-spacing: 1px;
  line-height: 45px;
  margin: 0.25rem;
  padding: 0 25px;
  transition: background-color 300ms ease-out;
  width: auto;
`;

export default function InvisibleActionButton(props) {
  return (
    <StyledButton onClick={props.clickHandler ? props.clickHandler : null}>{props.buttonLabel}</StyledButton>
  )
};