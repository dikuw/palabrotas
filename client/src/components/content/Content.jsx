import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";

import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useNotificationStore } from '../../store/notification';

const ContentWrapper = styled.div`
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

const Content = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const { getContentById } = useContentStore();
  const { authStatus } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await getContentById(id);
        console.log("content", content);
        setContent(content);
      } catch (error) {
        console.error('Error fetching content:', error);
        addNotification(t('Failed to load content'), 'error');
      }
    };

    fetchContent();
  }, [id, addNotification, t]);

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
      {/* Add more fields as needed */}
    </ContentWrapper>
  );
};

export default Content;