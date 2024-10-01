import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus } from 'react-icons/fa';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useFlashcardStore } from '../../store/flashcard';
import { useNotificationStore } from '../../store/notification';

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
  top: 40px; // Adjusted to be below the flag
  right: 10px;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 400;
  cursor: pointer;
`;

const StyledFlagIcon = styled(ReactCountryFlag)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1rem !important;
`;

const StyledAddToFlashcardIcon = styled(FaPlus)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 1rem;
  cursor: pointer;
  color: var(--primary);
  &:hover {
    color: var(--secondary);
  }
`;

export default function Card({ item, showEditIcon }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addFlashcard } = useFlashcardStore(); 
  const { authStatus } = useAuthStore(); 
  const addNotification = useNotificationStore(state => state.addNotification);
  const handleClick = (item) => {
    navigate(`/editContent/${item._id}`);
  };

  const handleAddToFlashcard = async (e) => {
    e.stopPropagation();
    try {
      await addFlashcard({ userId: authStatus.user._id, contentId: item._id });
      addNotification(t('Added to flashcards successfully!'), 'success');
    } catch (error) {
      console.error('Error adding to flashcards:', error);
      addNotification(t('Failed to add to flashcards. Please try again.'), 'error');
    }
  };

  return (
  <StyledGridFigure>
    {item.country && (
      <StyledFlagIcon countryCode={item.country} svg />
    )}
    {showEditIcon && (
      <StyledEditIcon onClick={() => handleClick(item)} title={t('Edit')} />
    )}
    <figcaption>
      <p>{item.title}</p>
      <p>{item.description}</p>
    </figcaption>
    {authStatus.isLoggedIn && (
      <StyledAddToFlashcardIcon 
        onClick={handleAddToFlashcard} 
        title={t('Add to Flashcards')}
      />
    )}
  </StyledGridFigure>
  );
};
