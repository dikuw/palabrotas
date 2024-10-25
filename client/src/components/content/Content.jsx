import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useCommentStore } from '../../store/comment';
import { useNotificationStore } from '../../store/notification';

import CommentForm from '../comment/CommentForm';

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--primary);
`;

const Description = styled.p`
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const ExampleSentence = styled.p`
  font-style: italic;
  margin-bottom: 20px;
`;

const AuthorInfo = styled.p`
  font-size: 0.9rem;
  color: var(--gray);
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1rem;
`;

const Content = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { authStatus } = useAuthStore();
  const { getContentById } = useContentStore();
  const { getCommentsByContentId, addComment } = useCommentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [content, setContent] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getContentById(id);
        setContent(content);
        getCommentsByContentId(id);
      } catch (error) {
        console.error('Error fetching content:', error);
        addNotification(t('Failed to load content'), 'error');
      }
    };

    fetchContent();
  }, [id, addNotification, t]);

  const handleAddComment = async (commentText) => {
    try {
      await addComment(id, authStatus.user._id, commentText);
      addNotification(t('Comment added successfully'), 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      addNotification(t('Failed to add comment'), 'error');
    }
  };

  if (!content) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <ContentWrapper>
      <ContentHeader>
        <Title>{content.title}</Title>
        {content.country && <ReactCountryFlag countryCode={content.country} svg />}
      </ContentHeader>
      <Description>{content.description}</Description>
      {content.exampleSentence && (
        <ExampleSentence>{content.exampleSentence}</ExampleSentence>
      )}
      <AuthorInfo>{t('Created by')}: {content.author}</AuthorInfo>
      <CommentSection>
        <ToggleButton onClick={() => setShowCommentForm(!showCommentForm)}>
          {showCommentForm ? <FaChevronUp /> : <FaChevronDown />}
          {t('Add a comment')}
        </ToggleButton>
        {showCommentForm && authStatus.isLoggedIn && (
          <CommentForm onSubmit={handleAddComment} />
        )}
      </CommentSection>
    </ContentWrapper>
  );
};

export default Content;