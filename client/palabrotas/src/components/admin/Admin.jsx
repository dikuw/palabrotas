import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InvisibleActionButton from '../shared/InvisibleActionButton';

const StyledDiv = styled.div`
  margin-bottom: 12px;
`;

export default function Admin(props) {

  const navigate = useNavigate(); 

  const goBack = () => {
    navigate("/");
  };

  return (
    <StyledDiv>
      <InvisibleActionButton clickHandler={goBack} buttonLabel={"Back to Site"} />
    </StyledDiv>
  );
}