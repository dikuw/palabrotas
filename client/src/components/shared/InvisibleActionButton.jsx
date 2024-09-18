import React from 'react';
import styled from 'styled-components';

const StyledButtonInvisible = styled.button`
  font-size: 0.8em;
  text-transform: uppercase;
  font-weight: 400;
  font-style: normal;
  color: var(--vinoTinto);
  background: white; 
  border: 0;
  display: inline-block;
  letter-spacing: 1px;
  margin-top: 0.5rem;
  padding: 5px 5px;
  width: 100%;
`;

export default function InvisibleActionButton(props) {
  return (
    <StyledButtonInvisible onClick={props.clickHandler ? props.clickHandler : null}>{props.buttonLabel}</StyledButtonInvisible>
  )
};