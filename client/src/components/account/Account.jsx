import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useContentStore } from '../../store/content';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';

import Banner from '../header/Banner';
import AccountGrid from './AccountGrid';
import Streak from './Streak';
import Spinner from '../shared/Spinner';

const StyledWrapperDiv = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 4px;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-height: 100px;
`;

export default function Account() {
  const { t } = useTranslation();
  const { getContentsByUserId } = useContentStore(); 
  const { authStatus } = useAuthStore();
  const { getCurrentStreak, getLongestStreak } = useUserStore();
  const [userContents, setUserContents] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreakLoading, setIsStreakLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (authStatus.isLoggedIn && authStatus.user) {
        setIsLoading(true);
        setIsStreakLoading(true);
        
        try {
          // Fetch contents
          const contents = await getContentsByUserId(authStatus.user._id);
          setUserContents(contents);
          setIsLoading(false);

          // Fetch streaks
          const [currentStreakData, longestStreakData] = await Promise.all([
            getCurrentStreak(authStatus.user._id),
            getLongestStreak(authStatus.user._id)
          ]);
          
          setCurrentStreak(currentStreakData.streak || 0);
          setLongestStreak(longestStreakData.streak || 0);
          setIsStreakLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
          setIsStreakLoading(false);
        }
      }
    }
  
    fetchData();
  }, [authStatus.isLoggedIn, authStatus.user, getContentsByUserId, getCurrentStreak, getLongestStreak]);
  
  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }

  return (
    <StyledWrapperDiv>
      <Streak 
        currentStreak={currentStreak} 
        longestStreak={longestStreak} 
        isLoading={isStreakLoading} 
      />
      
      <Banner bannerString={t("Your Content")} />
      
      {isLoading ? (
        <SpinnerContainer>
          <Spinner size="40px" />
        </SpinnerContainer>
      ) : (
        <AccountGrid contents={userContents} />
      )}
    </StyledWrapperDiv>
  )
};
