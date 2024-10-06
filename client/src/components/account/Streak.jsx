import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StreakContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StreakItem = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
`;

const StreakLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const StreakValue = styled.span`
  color: #007bff;
`;

const StreakInfo = ({ currentStreak, longestStreak }) => {
  const { t } = useTranslation();

  return (
    <StreakContainer>
      <StreakItem>
        <StreakLabel>{t("Current Streak")}:</StreakLabel>
        <StreakValue>
          {currentStreak > 0 
            ? t("{{count}} day", { count: currentStreak }) 
            : t("No current streak. Start a streak today!")}
        </StreakValue>
      </StreakItem>
      <StreakItem>
        <StreakLabel>{t("Longest Streak")}:</StreakLabel>
        <StreakValue>
          {longestStreak > 0 
            ? t("{{count}} day", { count: longestStreak }) 
            : t("No streak recorded. Start a streak today!")}
        </StreakValue>
      </StreakItem>
    </StreakContainer>
  );
};

export default StreakInfo;