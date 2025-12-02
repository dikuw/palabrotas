import React from 'react';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";

const StyledCourseContainer = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledContent = styled.div`
  max-width: 800px;
  width: 100%;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledPlaceholder = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
`;

export default function Course(props) {
  const { t } = useTranslation();

  return (
    <>
      <StyledCourseContainer>
        <StyledContent>
          <StyledPlaceholder>
            <h2>{t("Course Content")}</h2>
            <p>{t("This is a placeholder for the course content. More features coming soon!")}</p>
          </StyledPlaceholder>
        </StyledContent>
      </StyledCourseContainer>
    </>
  );
}

