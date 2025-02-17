import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Users from './Users';
import InvisibleActionButton from '../shared/InvisibleActionButton';

const StyledDiv = styled.div`
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1000px;
  margin: 30px auto;
  justify-content: center; 
  margin-bottom: 12px;
`;

export default function Admin(props) {

  const navigate = useNavigate(); 

  const goBack = () => {
    navigate("/");
  };

  return (
    <StyledDiv>
      <Users />
      <InvisibleActionButton clickHandler={goBack} buttonLabel={"Back to Site"} />
    </StyledDiv>
  );
}