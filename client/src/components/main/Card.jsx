import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaChevronUp, FaChevronDown  } from 'react-icons/fa';
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content'; 
import { useFlashcardStore } from '../../store/flashcard';
import { useVoteStore } from '../../store/vote';
import { useNotificationStore } from '../../store/notification';

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 152px;
  margin: 0 0 1rem 0;
`;

const BackgroundCard = styled.div`
  position: absolute;
  width: 100%;
  height: calc(95%);
  border: 1px solid #000;
  border-radius: 9px;
  background: var(--primary);
  top: 7px;
  left: 7px;
`;

const StyledGridFigure = styled.figure`
  width: 100%;
  height: 144px;
  padding: 2rem;
  border: 1px solid #000;
  border-radius: 9px;
  background: #FFF;
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin: 0;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StyledFlagIcon = styled(ReactCountryFlag)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 1rem !important;
`;

const StyledEditIcon = styled(FaEdit)`
  position: absolute;
  top: 70px;
  right: 10px;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: 400;
  cursor: pointer;
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

const StyledAuthorText = styled.span`
  position: absolute;
  bottom: 10px;
  right: 40px; // Positioned to the left of the add icon
  font-size: 0.6rem;
  color: var(--gray);
  font-style: italic; 
`;

const VoteIcons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
`;

const VoteIcon = styled.div`
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
  const { addVote } = useVoteStore(); 
  const { getContentsSortedByVoteDesc } = useContentStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const handleClick = () => {
    navigate(`/content/${item._id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/editContent/${item._id}`);
  };

  const handleAddToFlashcard = async (e) => {
    e.stopPropagation();
    try {
      const result = await addFlashcard({ userId: authStatus.user._id, contentId: item._id });
      if (result.success) {
        addNotification(t('Added to flashcards successfully!'), 'success');
      } else {
        addNotification(result.message, 'info');
      }
    } catch (error) {
      console.error('Error adding to flashcards:', error);
      addNotification(t('Failed to add to flashcards. Please try again.'), 'error');
    }
  };

  const handleVote = async (voteType) => {
    if (!authStatus.isLoggedIn || !authStatus.user?._id) {
      addNotification(t('Please log in to vote'), 'info');
      return;
    }

    try {
      const result = await addVote(item._id, authStatus.user._id, voteType);
      if (result.success) {
        addNotification(t('Vote recorded successfully!'), 'success');
        await getContentsSortedByVoteDesc();
      } else {
        addNotification(result.message, 'info');
      }
    } catch (error) {
      console.error('Error voting:', error);
      addNotification(t('Failed to record vote. Please try again.'), 'error');
    }
  };

  return (
    <CardContainer onClick={handleClick}>
      <BackgroundCard />
      <StyledGridFigure>
        {item.country && (
          <StyledFlagIcon countryCode={item.country} svg />
        )}
        {showEditIcon && (
          <StyledEditIcon onClick={handleEdit} title={t('Edit')} />
        )}
        <figcaption>
          <p>{item.title}</p>
          <p>{item.description}</p>
        </figcaption>
        <StyledAuthorText>{t('created by')}: {item.author}</StyledAuthorText> 
        {authStatus.isLoggedIn && (
          <StyledAddToFlashcardIcon 
            onClick={handleAddToFlashcard} 
            title={t('Add to Flashcards')}
          />
        )}
        <VoteIcons>
          <VoteIcon onClick={(e) => { e.stopPropagation(); handleVote('upvote'); }}>
            <FaChevronUp />
          </VoteIcon>
          <VoteIcon onClick={(e) => { e.stopPropagation(); handleVote('downvote'); }}>
            <FaChevronDown />
          </VoteIcon>
        </VoteIcons>
      </StyledGridFigure>
    </CardContainer>
  );
};
