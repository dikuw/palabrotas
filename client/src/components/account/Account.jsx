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
const StyledWrapperDiv = styled.div`
  width: 90%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 4px;
`;

export default function Account() {
  const { t } = useTranslation();
  const { getContentsByUserId } = useContentStore(); 
  const { authStatus } = useAuthStore();
  const { getCurrentStreak, getLongestStreak } = useUserStore();
  const [userContents, setUserContents] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    async function fetchUserContents() {
      if (authStatus.isLoggedIn && authStatus.user) {
        const contents = await getContentsByUserId(authStatus.user._id);
        setUserContents(contents);

        const currentStreakData = await getCurrentStreak(authStatus.user._id);
        setCurrentStreak(currentStreakData.length || 0);
        
        const longestStreakData = await getLongestStreak(authStatus.user._id);
        setLongestStreak(longestStreakData.length || 0);
      }
    }
  
    fetchUserContents();
  }, [authStatus.isLoggedIn, authStatus.user, getContentsByUserId, getCurrentStreak, getLongestStreak]);
  
  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }
  return (
    <StyledWrapperDiv>
      <Streak currentStreak={currentStreak} longestStreak={longestStreak} />
      <Banner bannerString={t("Your Content")} />
      <AccountGrid contents={userContents} />
    </StyledWrapperDiv>
  )
};
