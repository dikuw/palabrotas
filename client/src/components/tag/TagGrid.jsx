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
  cursor: pointer;
  box-shadow: 1px 1px 0 rgba(0,0,0,.2);

  /* Create the tag "fold" */
  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    background: inherit;
    border: 10px solid white;
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
    background: #eff0f3;
    position: absolute;
    left: -3px;
    top: 12px;
    box-shadow: inset 1px 1px 0 rgba(0,0,0,.2);
  }

  &:hover {
    background: var(--primaryDark);
  }
`;

const SpinnerContainer = styled.div`
  background: var(--fondo);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const DeleteButton = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--error);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 12px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.3);

  ${TagItem}:hover & {
    display: flex;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

function TagGrid({ contentId, refreshTrigger }) {
  const { getTagsForContent, removeTagFromContent } = useTagStore();
  const [contentTags, setContentTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const response = await getTagsForContent(contentId);
        if (response.success) {
          setContentTags(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contentId) {
      fetchTags();
    }
  }, [contentId, getTagsForContent, refreshTrigger]);

  const handleRemoveTag = async (tagId, e) => {
    e.stopPropagation(); // Prevent tag click event
    try {
      const response = await removeTagFromContent(contentId, tagId);
      if (response.success) {
        setContentTags(prev => prev.filter(tag => tag._id !== tagId));
      }
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  return (
    <StyledTagGrid>
      {isLoading ? (
        <SpinnerContainer>
          <img 
            src="/images/spinner.gif" 
            alt="Loading..." 
          />
        </SpinnerContainer>
      ) : (
        contentTags.map(tag => (
          <TagItem key={tag._id}>
            {tag.name}
            <DeleteButton onClick={(e) => handleRemoveTag(tag._id, e)}>
              ×
            </DeleteButton>
          </TagItem>
        ))
      )}
    </StyledTagGrid>
  );
}

export default TagGrid;