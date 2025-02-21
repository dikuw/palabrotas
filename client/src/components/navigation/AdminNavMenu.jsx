import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useAppStore } from '../../store/app';
import { useTranslation } from "react-i18next";

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  z-index: 19;

  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: white;
    position: fixed;
    transform: ${({ $menuOpen }) => $menuOpen ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    width: 100%;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;
  }
`;

const Li = styled.li`
  text-align: center;
  flex-grow: 1;
  height: 100%;
  @media (min-width: 768px) {
    :hover {
      background-color: var(--primary);
    }
  }
`;

const Link = styled.a`
  display:block;
  width: 100%;
  color: black;
  cursor: pointer;
  :hover {
    text-decoration: none;
  }
`;

export default function AdminNavMenu({ menuOpen, isLoggedIn, isAdmin }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setMenuOpen } = useAppStore();
  
  const handleClick = (link, menuOpen) => {
    setMenuOpen(!menuOpen)
    navigate(link);
  }
 
  return (
    <Ul $menuOpen={menuOpen}>
      {!isLoggedIn && <Li><Link onClick={() => handleClick('/login', menuOpen) } >{t("Log In")}</Link></Li>}
      {isAdmin &&
        <>
          <Li><Link onClick={() => handleClick('/', menuOpen) } >{t("Back to Site")}</Link></Li>
        </>
      }
    </Ul>
  );
}