import React from 'react';
import styled from 'styled-components';

const StyledGridFigure = styled.figure`
  flex-basis: calc(33.333% - 4rem);
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 2rem 2rem 2rem;
  padding: 2rem;
  border: 1px solid var(--primary);
  background: var(--almostWhite);
  box-shadow: 0 0 0 5px rgba(0,0,0,0.03);
  position: relative;
  max-width: 400px;
`;

export default function Card(props) {
  const { item } = props;
  return (
  <StyledGridFigure>
    <figcaption>
      <p>{item.title}</p>
      <p>{item.description}</p>
    </figcaption>
  </StyledGridFigure>
  );
};
