import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import NavMenu from './NavMenu';
import AdminNavMenu from './AdminNavMenu';

import { useAppStore } from '../../store/app';

const StyledBurger = styled.div`
  width: 2rem;
  height: 2rem;
  z-index: 20;
  display: none;
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    background-color: ${({ $menuOpen }) => $menuOpen ? '#ccc' : '#333'};
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;
    &:nth-child(1) {
      transform: ${({ $menuOpen }) => $menuOpen ? 'rotate(45deg)' : 'rotate(0)'};
    }
    &:nth-child(2) {
      transform: ${({ $menuOpen }) => $menuOpen ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${({ $menuOpen }) => $menuOpen ? 0 : 1};
    }
    &:nth-child(3) {
      transform: ${({ $menuOpen }) => $menuOpen ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

export default function Burger(props) {
  const { menuOpen, setMenuOpen } = useAppStore();
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <>
      <StyledBurger $menuOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} >
        <div />
        <div />
        <div />
      </StyledBurger>
      {(currentRoute === "/admin" || currentRoute === "/contents") ? (
          <AdminNavMenu isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} />
        ) : (
          <NavMenu isLoggedIn={props.isLoggedIn} isAdmin={props.isAdmin} logoutUser={props.logoutUser} />
       )
      }
    </>
  );
}