import React from 'react';
import Card from './Card'
import styled from 'styled-components';

const StyledGrid = styled.div`
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 30px auto;
`;

export default function Grid(props) {
  return (
    <StyledGrid>
      {props.contents.map((item) => 
        <Card key={item._id} index={item._id} item={item} />
      )}
    </StyledGrid>
  )
}
