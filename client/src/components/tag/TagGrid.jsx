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
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
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