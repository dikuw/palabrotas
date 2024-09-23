import React from 'react';
import styled from 'styled-components';

const StyledGridFigure = styled.figure`
  width: 100%;
  margin: 0 0 2rem 0;
  padding: 2rem;
  border: 1px solid var(--primary);
  background: var(--almostWhite);
  box-shadow: 0 0 0 5px rgba(0,0,0,0.03);
  position: relative;
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
