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
import TagGrid from '../tag/TagGrid';
import AddTagToContent from '../tag/AddTagToContent';

const OuterContainer = styled.div`
  padding: 20px;
  padding-top: 0;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormWrapper = styled.div`
  position: relative;
  width: 99%;
  max-width: 800px;
  margin: 10px auto 20px;
  z-index: 1;
`;

const ContentContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 9px;
  border: 1px solid #000;
  padding: 20px;
  position: relative;
  z-index: 4;
`;

const BackgroundCard = styled.div`
  position: absolute;
  width: 100%;
  height: 60px;
  border-radius: 9px;
  border: 1px solid #000;
  background-color: var(--primary);
  z-index: ${props => 3 - props.$index};
  bottom: ${props => -5 - (props.$index * 5)}px;
  left: 0;
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

const TagContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between; 
  gap: 10px;
  margin: 10px 0;
  background-color: white;
`;

const AddTagButton = styled.button`
  background: #f0f0f0;
  border: 1px dashed #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background: #e0e0e0;
  }
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
  gap: 8px;  
  font-size: 1rem;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
`;

const CommentItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 10px 0;
`;

const CommentText = styled.p`
  margin-bottom: 5px;
`;

const CommentMeta = styled.div`
  font-size: 0.8rem;
  color: var(--gray);
`;

const Content = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { authStatus } = useAuthStore();
  const { getContentById } = useContentStore();
  const { comments, getCommentsByContentId, addComment } = useCommentStore();
  const addNotification = useNotificationStore(state => state.addNotification);
  const [content, setContent] = useState(null);
  const [showAddTag, setShowAddTag] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchContentAndComments = async () => {
      try {
        const contentData = await getContentById(id);
        setContent(contentData);
        await getCommentsByContentId(id);
      } catch (error) {
        console.error('Error fetching content or comments:', error);
        addNotification(t('Failed to load content or comments'), 'error');
      }
    };

    fetchContentAndComments();
  }, [id, addNotification, t]);

  const handleAddComment = async (commentText) => {
    try {
      const result = await addComment(id, authStatus.user._id, commentText);
      if (result) {
        // Fetch fresh comments to get populated owner data
        await getCommentsByContentId(id);
        addNotification(t('Comment added successfully'), 'success');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      addNotification(t('Failed to add comment'), 'error');
    }
  };

  const handleAddTagClose = () => {
    setShowAddTag(false);
  };

  const handleTagsUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!content) {
    return <div>{t('Loading...')}</div>;
  }

  return (
    <OuterContainer>
      <FormWrapper>
        <ContentContainer>
          <ContentHeader>
            <Title>{content.title}</Title>
            {content.country && <ReactCountryFlag countryCode={content.country} svg />}
          </ContentHeader>
          <Description>{content.description}</Description>
          {content.exampleSentence && (
            <ExampleSentence>{content.exampleSentence}</ExampleSentence>
          )}
          <AuthorInfo>{t('Created by')}: {content.author}</AuthorInfo>
          <TagContainer>
            <TagGrid 
              contentId={content._id} 
              refreshTrigger={refreshTrigger}
            />
            <AddTagButton onClick={() => setShowAddTag(true)}>
              {t('+ Add Tag')}
            </AddTagButton>
          </TagContainer>
          {showAddTag && (
            <AddTagToContent 
              contentId={content._id} 
              onClose={handleAddTagClose}
              onSave={handleTagsUpdated}
            />
          )}
          <CommentSection>
            <ToggleButton onClick={() => setShowComments(!showComments)}>
              {showComments ? <FaChevronUp /> : <FaChevronDown />}
              {t('Show Comments')} ({comments.length})
            </ToggleButton>
            {showComments && (
              <>
                <CommentList>
                  {comments.map((comment) => (
                    <CommentItem key={comment._id}>
                      <CommentText>{comment.text}</CommentText>
                      <CommentMeta>
                        {t('Created by')}: {comment.owner.name} | {new Date(comment.createdAt).toLocaleString()}
                      </CommentMeta>
                    </CommentItem>
                  ))}
                </CommentList>
                {authStatus.isLoggedIn && (
                  <CommentForm onSubmit={handleAddComment} />
                )}
              </>
            )}
          </CommentSection>
        </ContentContainer>
        {[0, 1, 2].map((index) => (
          <BackgroundCard key={index} $index={index} />
        ))}
      </FormWrapper>
    </OuterContainer>
  );
};

export default Content;