import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";
import { useCourseStore } from '../../store/course';
import Lesson from './Lesson';
import Spinner from '../shared/Spinner';

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


const StyledContent = styled.div`
  max-width: 800px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

export default function Course(props) {
  const { t } = useTranslation();
  const { lessons, currentLesson, lessonContent, getLessons, getLesson, getLessonContent } = useCourseStore();
  const [selectedLesson, setSelectedLesson] = useState('');
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  useEffect(() => {
    const loadLessons = async () => {
      setIsLoadingLessons(true);
      try {
        await getLessons();
      } catch (error) {
        console.error('Error loading lessons:', error);
      } finally {
        setIsLoadingLessons(false);
      }
    };
    loadLessons();
  }, [getLessons]);

  useEffect(() => {
    if (selectedLesson) {
      const loadLesson = async () => {
        setIsLoadingLesson(true);
        try {
          await Promise.all([
            getLesson(selectedLesson),
            getLessonContent(selectedLesson)
          ]);
        } catch (error) {
          console.error('Error loading lesson:', error);
        } finally {
          setIsLoadingLesson(false);
        }
      };
      loadLesson();
    }
  }, [selectedLesson, getLesson, getLessonContent]);

  const handleLessonChange = (e) => {
    setSelectedLesson(e.target.value);
  };

  if (isLoadingLessons) {
    return (
      <StyledCourseContainer>
        <StyledContent>
          <SpinnerContainer>
            <Spinner size="40px" />
          </SpinnerContainer>
        </StyledContent>
      </StyledCourseContainer>
    );
  }

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
              </LessonInfo>
            )}
          </HeaderSection>
          {isLoadingLesson ? (
            <SpinnerContainer>
              <Spinner size="40px" />
            </SpinnerContainer>
          ) : (
            <Lesson lesson={currentLesson} vocabulary={lessonContent} isLoading={isLoadingLesson} />
          )}
        </StyledContent>
      </StyledCourseContainer>
    </>
  );
}

