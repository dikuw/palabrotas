import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import ContentGrid from '../main/ContentGrid';

const EmptyMessage = styled.p`
  text-align: center;
  margin: 24px auto;
  color: #555;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const StyledLink = styled(Link)`
  color: var(--primary);
  font-weight: bold;
  text-decoration: underline;
`;

export default function AccountGrid({ contents }) {
  if (!contents?.length) {
    return (
      <EmptyMessage>
        <Trans
          i18nKey="You haven't added any content yet. Go here to <addContentLink>Add Content</addContentLink>"
          components={{
            addContentLink: <StyledLink to="/addContent" />,
          }}
        />
      </EmptyMessage>
    );
  }

  return <ContentGrid contents={contents} showEditIcon={true} />;
}
