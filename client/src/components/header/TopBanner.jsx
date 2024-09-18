import React from 'react';
import styled from 'styled-components';

const BannerDiv = styled.div`
  display: block;
  width: 100%;
  background-color: var(--secondary);
  color:  var(--almostWhite);
  padding: 7px 10px;
  text-align: center;
`;

export default function TopBanner(props) {
 
  return (
    <BannerDiv>
      {"Welcome"} {props.isLoggedIn ? props.name : "guest"}!
    </BannerDiv>
  )
}