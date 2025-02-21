import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Users from './Users';

const StyledDiv = styled.div`
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1000px;
  margin: 30px auto;
  justify-content: center; 
  margin-bottom: 12px;
  position: relative;
`;

const ButtonContainer = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
`;

const Button = styled.button`
  flex: 1;
  height: 2.5rem;
  padding: 10px 15px;
  border-radius: 24px;
  border: ${props => props.$primary ? 'none' : '1px dashed #000'};
  background-color: ${props => props.$primary ? 'var(--primary)' : 'white'};
  color: ${props => props.$primary ? 'white' : 'var(--text)'};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
  }
`;

export default function Admin(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goBack = () => {
    navigate("/");
  };

  return (
    <StyledDiv>
      <Users />
      <ButtonContainer>
        <Button type="submit" $primary onClick={goBack}>{t("Back to Site")}</Button>
      </ButtonContainer>
    </StyledDiv>
  );
}