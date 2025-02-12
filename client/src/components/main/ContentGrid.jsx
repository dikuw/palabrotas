import React from 'react';
import styled from 'styled-components';
import Card from '../main/Card';

const GridContainer = styled.div`
  display: grid;
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1000px;
  margin: 15px auto;
  justify-content: center; 
`;

const ContentGrid = ({ contents, showEditIcon }) => {
  return (
    <GridContainer>
      {contents.map(item => (
        <Card key={item._id} item={item} showEditIcon={showEditIcon} />
      ))}
    </GridContainer>
  );
};

export default ContentGrid;