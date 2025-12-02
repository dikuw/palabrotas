import React from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";

const LessonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LessonTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
`;

const LessonDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const VocabularySection = styled.div`
  margin-top: 1rem;
`;

const VocabularyTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 1rem;
`;

const VocabularyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  min-height: 200px;
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
      <div>
        <LessonTitle>{lesson.title}</LessonTitle>
        {lesson.description && (
          <LessonDescription>{lesson.description}</LessonDescription>
        )}
      </div>
      <VocabularySection>
        <VocabularyTitle>{t("Vocabulary")}</VocabularyTitle>
        <VocabularyContent>
          {vocabulary && vocabulary.length > 0 ? (
            vocabulary.map((item) => (
              <div key={item._id}>
                <strong>{item.title}</strong> - {item.description}
              </div>
            ))
          ) : (
            <PlaceholderText>{t("No vocabulary content available")}</PlaceholderText>
          )}
        </VocabularyContent>
      </VocabularySection>
    </LessonContainer>
  );
}

