import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import ReactCountryFlag from "react-country-flag";
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

const StyledEditIcon = styled(FaEdit)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 400;
  cursor: pointer;
`;

const StyledFlagIcon = styled(ReactCountryFlag)`
  position: absolute;
  top: 10px;
  right: 40px;
  font-size: 1rem !important;
`;

export default function Card({ item, showEditIcon }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = (item) => {
    navigate(`/editContent/${item._id}`);
  };

  return (
  <StyledGridFigure>
    {item.country && (
      <StyledFlagIcon countryCode={item.country} svg />
    )}
    {showEditIcon && (
      <StyledEditIcon onClick={() => handleClick(item)}>{t('Edit')}</StyledEditIcon>
    )}
    <figcaption>
      <p>{item.title}</p>
      <p>{item.description}</p>
    </figcaption>
  </StyledGridFigure>
  );
};
