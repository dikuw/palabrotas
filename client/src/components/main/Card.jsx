import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

const StyledGridFigure = styled.figure`
  width: 100%;
  margin: 0 0 2rem 0;
  padding: 2rem;
  border: 1px solid var(--primary);
  background: var(--almostWhite);
  box-shadow: 0 0 0 5px rgba(0,0,0,0.03);
  position: relative;
`;

const StyledEditButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.6rem;
  text-transform: uppercase;
  font-weight: 400;
  font-style: normal;
  background: var(--primary);
  border-color: var(--primary);
  border-radius: 2px;
  border: 0;
  color: var(--almostWhite);
  display: inline-block;
  height: 35px;
  letter-spacing: 1px;
  line-height: 35px;
  margin: 0;
  padding: 0 15px;
  transition: background-color 300ms ease-out;
  width: auto;
  cursor: pointer;
`;

export default function Card(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { item } = props;
  
  const handleClick = (item) => {
    navigate(`/editContent/${item._id}`);
  };

  return (
  <StyledGridFigure>
    <StyledEditButton onClick={() => handleClick(item)}>{t('Edit')}</StyledEditButton>
    <figcaption>
      <p>{item.title}</p>
      <p>{item.description}</p>
    </figcaption>
  </StyledGridFigure>
  );
};
