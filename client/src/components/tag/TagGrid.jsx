import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useTagStore } from '../../store/tag';

const StyledTagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin: 10px 0;
`;

const TagItem = styled.div`
  display: inline-block;
  background: var(--primary);
  color: #FFF;
  padding: 5px 10px;
  margin: 2px 2px 2px 20px;
  font: normal 16px 'Inter', sans-serif;
  position: relative;
  cursor: default;
  box-shadow: 1px 1px 0 rgba(0,0,0,.2);

  /* Create the tag "fold" */
  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    background: inherit;
    border: 10px solid var(--fondo);
    border-right-color: transparent;
    border-radius: 10px 0 0 10px;
    left: -20px;
    top: 0;
  }

  /* Create the hole */
  &:after {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: #FFF;
    position: absolute;
    left: -3px;
    top: 12px;
    box-shadow: inset 1px 1px 0 #CCC;
  }
`;

function TagGrid({ contentId }) {
  const { getTagsForContent } = useTagStore();
  const [contentTags, setContentTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await getTagsForContent(contentId);
      if (response.success) {
        setContentTags(response.data);
      }
    };
    
    if (contentId) {
      fetchTags();
    }
  }, [contentId, getTagsForContent]);

  return (
    <StyledTagGrid>
      {contentTags.map(tag => (
        <TagItem key={tag._id}>{tag.name}</TagItem>
      ))}
    </StyledTagGrid>
  );
}

export default TagGrid;