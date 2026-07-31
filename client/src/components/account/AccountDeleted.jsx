import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const OuterContainer = styled.div`
  padding: 20px;
  padding-top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  width: 99%;
  max-width: 800px;
  margin: 10px auto 20px;
  background: white;
  border: 1px solid #000;
  border-radius: 9px;
  padding: 28px 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0 0 12px;
`;

const Message = styled.p`
  color: #444;
  line-height: 1.5;
  margin: 0 0 20px;
`;

const StyledLink = styled(Link)`
  color: var(--primary);
  text-decoration: underline;
`;

export default function AccountDeleted() {
  const { t } = useTranslation();

  return (
    <OuterContainer>
      <Card>
        <Title>{t('Your account has been deleted')}</Title>
        <Message>
          {t('Your account and personal data have been removed. We’re sorry to see you go.')}
        </Message>
        <StyledLink to="/">{t('Back to Home')}</StyledLink>
      </Card>
    </OuterContainer>
  );
}
