import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  padding: 10px 10px 0px 10px;
  color: var(--almostWhite);
  background-color: var(--secondary);
  border-top: 1px solid var(--primary);
  font-size: 0.8rem;
  ul {
    list-style: none;
    padding-left: 0;
  }
  a {
    color: var(--almostWhite);
    :hover {
      text-decoration: none;
    }
  }
`;

const StyledLegal = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: #FFFFFF;
  flex:  1 100%;
  a {
    color: #FFFFFF;
  }
  @media (min-width: 40.375em) {
    margin-left: auto;
  }
`;

export default function Footer() {
  const { t } = useTranslation();
  return (
    <StyledFooter >
      <StyledLegal>
        <p>&copy; 2024</p>
        <p>{t("Created with")}<a rel="noopener noreferrer" href="http://www.dikuw.com/" target="_blank"> 🖤</a></p>
      </StyledLegal>
    </StyledFooter>
  );
};