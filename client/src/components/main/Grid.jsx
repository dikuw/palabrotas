import React from 'react';
import { useContentStore } from '../../store/content';
import Card from './Card'
import styled from 'styled-components';

const StyledGrid = styled.div`
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1000px;
  margin: 30px auto;
  justify-content: center; 
`;

export default function Grid() {
  const { contents, searchResults } = useContentStore();
  
  const displayContents = searchResults.length > 0 ? searchResults : contents;

  return (
    <StyledGrid>
      {displayContents.map((item) => 
        <Card key={item._id} index={item._id} item={item} />
      )}
    </StyledGrid>
  )
}
