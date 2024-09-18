import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const StyledDiv = styled.div`
  margin-bottom: 12px;
`;

export default function Header() {
  return (
    <StyledDiv>
      <Logo />
    </StyledDiv>
  );
}
