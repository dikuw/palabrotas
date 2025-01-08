import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Spinner from '../shared/Spinner';

const StreakContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const StreakItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
`;

const StreakLabel = styled.span`
  font-weight: bold;
`;

const StreakValue = styled.span`
  color: var(--primary);
  font-weight: bold;
`;

export default function Streak({ currentStreak, longestStreak, isLoading }) {
  const { t } = useTranslation();

  return (
    <StreakContainer>
      <StreakItem>
        <StreakLabel>{t("Current Streak:")} </StreakLabel>
        {isLoading ? (
          <Spinner size="20px" />
        ) : (
          <StreakValue>{currentStreak}</StreakValue>
        )}
      </StreakItem>

      <StreakItem>
        <StreakLabel>{t("Longest Streak:")} </StreakLabel>
        {isLoading ? (
          <Spinner size="20px" />
        ) : (
          <StreakValue>{longestStreak}</StreakValue>
        )}
      </StreakItem>
    </StreakContainer>
  );
}