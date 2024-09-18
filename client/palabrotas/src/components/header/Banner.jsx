import React from 'react';
import styled from 'styled-components';

const StyledBannerDiv = styled.div`
  width: 100%;
  color: var(--almostWhite);
  background-color: var(--primary);
  text-transform: uppercase;
  font-size: 0.9em;
  font-weight: 400;
  padding: 5px 20px;
  text-align: center;
`;

export default function Banner(props) {
  return (
    <StyledBannerDiv>{props.bannerString}</StyledBannerDiv>
  );
}
