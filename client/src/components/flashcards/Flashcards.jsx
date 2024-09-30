import React, { useState } from 'react';
import styled from 'styled-components';
import { useContentStore } from '../../store/content';
import { useAuthStore } from '../../store/auth';
import { NoPermissionDiv } from '../shared/index';
import { useTranslation } from 'react-i18next';

import Banner from '../header/Banner';

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
  const { contents } = useContentStore();
  const { authStatus } = useAuthStore();

  if (!authStatus.isLoggedIn || !authStatus.user) {
    return <NoPermissionDiv divLabel={t("Please log in to view this page")}></NoPermissionDiv>
  }
  return (
    <StyledWrapperDiv>
      <Banner bannerString={t("Your Flashcards")} />

    </StyledWrapperDiv>
  )
};
