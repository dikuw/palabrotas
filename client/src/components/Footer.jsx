import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  display: flex;
  flex-flow: row wrap;
  padding: 30px 30px 0px 30px;
  color: var(--almostWhite);
  background-color: var(--primary);
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
  color: #999;
  flex:  1 100%;
  a {
    color: #999999;
  }
  @media (min-width: 40.375em) {
    margin-left: auto;
  }
`;

export default function Footer(props) {

  return (
    <StyledFooter >
      <StyledLegal>
        <p>&copy; 2024 dikuw</p>
        <p>{"Created by"}<a rel="noopener noreferrer" href="http://www.dikuw.com/" target="_blank"> dikuw</a></p>
      </StyledLegal>
    </StyledFooter>
  );
};