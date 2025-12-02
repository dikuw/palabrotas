import React from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import LessonContent from './LessonContent';

const LessonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LessonDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const VocabularySection = styled.div`
  margin-top: 1rem;
`;

const PlaceholderText = styled.p`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 2rem;
`;

export default function Lesson({ lesson, vocabulary }) {
  const { t } = useTranslation();

  if (!lesson) {
    return (
      <LessonContainer>
        <PlaceholderText>{t("Select a lesson to view its content")}</PlaceholderText>
      </LessonContainer>
    );
  }

  return (
    <LessonContainer>
      {lesson.description && (
        <LessonDescription>{lesson.description}</LessonDescription>
      )}
      <VocabularySection>
        <LessonContent vocabulary={vocabulary} />
      </VocabularySection>
    </LessonContainer>
  );
}

