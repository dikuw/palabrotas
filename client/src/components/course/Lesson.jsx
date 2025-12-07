import React from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import LessonContent from './LessonContent';

const LessonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const VocabularySection = styled.div`
  margin-top: 0;
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
      <VocabularySection>
        <LessonContent vocabulary={vocabulary} lesson={lesson} />
      </VocabularySection>
    </LessonContainer>
  );
}

