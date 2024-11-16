import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const NoResultsDiv = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

export default function NoResults() {
  const { t } = useTranslation();

  return (
    <NoResultsDiv>
      {t('No results found. Please try another search.')}
    </NoResultsDiv>
  );
}