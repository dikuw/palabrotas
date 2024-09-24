import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../store/user';

const BannerDiv = styled.div`
  display: block;
  width: 100%;
  background-color: var(--secondary);
  color:  var(--almostWhite);
  padding: 7px 10px;
  text-align: center;
`;

export default function TopBanner(props) {

  const { checkAuthStatus } = useUserStore();
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const status = await checkAuthStatus();
      setAuthStatus(status);
    };

    fetchAuthStatus();
  }, [checkAuthStatus]);

  return (
    <BannerDiv>
      {"Welcome"} {authStatus ? authStatus.user.name : "guest"}!
    </BannerDiv>
  )
}