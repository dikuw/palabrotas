import React from 'react';
import styled from 'styled-components';

import logo from '../../logo.svg';

const LogoImage = styled.img`
  display: block;
  width: 100px;
  margin: auto;
  padding: 15px;
`;

export default function Logo() {
  return (
    <a href="/">
      <LogoImage src={logo} alt="WI Writer dot com" />
    </a>
  );
};