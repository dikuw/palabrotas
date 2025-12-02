import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { useCourseStore } from '../../store/course';
import Lesson from './Lesson';

const StyledCourseContainer = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const HeaderSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const LessonDropdown = styled.select`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--secondary);
  border-radius: 20px;
  background-color: white;
  color: #000000;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 8px 10px;
  padding-right: 2.5rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &:hover {
    border-color: var(--primary);
  }
`;

const LessonInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  height: calc(0.75rem * 2 + 1rem + 2px); /* Match dropdown height */
`;

const LessonTitleText = styled.h2`
  font-size: 1rem;
  color: var(--primary);
  margin: 0;
  text-align: left;
  line-height: 1.2;
`;

const LessonDescriptionText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0 0 0;
  text-align: left;
  line-height: 1.2;
`;

const StyledContent = styled.div`
  max-width: 800px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default function Course(props) {
  const { t } = useTranslation();
  const { lessons, currentLesson, lessonContent, getLessons, getLesson, getLessonContent } = useCourseStore();
  const [selectedLesson, setSelectedLesson] = useState('');

  useEffect(() => {
    getLessons();
  }, [getLessons]);

  useEffect(() => {
    if (selectedLesson) {
      getLesson(selectedLesson);
      getLessonContent(selectedLesson);
    }
  }, [selectedLesson, getLesson, getLessonContent]);

  const handleLessonChange = (e) => {
    setSelectedLesson(e.target.value);
  };

  return (
    <>
      <StyledCourseContainer>
        <StyledContent>
          <HeaderSection>
            {lessons.length > 0 && (
              <LessonDropdown 
                value={selectedLesson} 
                onChange={handleLessonChange}
              >
                <option value="">{t("Select a lesson...")}</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>
                    {t("Lesson")} {lesson.lessonNumber}
                  </option>
                ))}
              </LessonDropdown>
            )}
            {currentLesson && (
              <LessonInfo>
                <LessonTitleText>
                  {currentLesson.title.replace(/^Lesson \d+:\s*/i, '')}
                </LessonTitleText>
                {currentLesson.description && (
                  <LessonDescriptionText>{currentLesson.description}</LessonDescriptionText>
                )}
              </LessonInfo>
            )}
          </HeaderSection>
          <Lesson lesson={currentLesson} vocabulary={lessonContent} />
        </StyledContent>
      </StyledCourseContainer>
    </>
  );
}

