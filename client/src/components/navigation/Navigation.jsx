import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Burger from './Burger';

const Nav = styled.nav`
  width: 100%;
  height: 2em;
  display: flex;
  padding: 0px 12vw;
  @media (max-width: 768px) {
    padding-left: 16px;
    padding-bottom: 40px;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }
`

export default function Navigation(props) {
  const location = useLocation();
  
  // Don't render navigation on Admin route
  if (location.pathname === '/admin') {
    return null;
  }

  return (
    <Nav>
      <Burger isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} history={props.history} logoutUser={props.logoutUser} />
    </Nav>
  );
};
