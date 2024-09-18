import React from 'react';
import styled from 'styled-components';

const StyledNoPermissionsDiv = styled.div`
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 30px auto;
  padding: 4px;
`;

export default function NoPermissionDiv(props) {
  return (
    <StyledNoPermissionsDiv >{props.divLabel}.</StyledNoPermissionsDiv>
  )
};