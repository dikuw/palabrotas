import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useAuthStore } from '../../store/auth';
import { useTagStore } from '../../store/tag';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const TagGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin: 15px 0;
  padding: 10px;
`;

const TagItem = styled.div`
  display: inline-block;
  background: ${props => props.selected ? 'var(--primaryDark)' : 'var(--primary)'};
  color: #FFF;
  padding: 5px 10px;
  margin: 2px 2px 2px 20px;
  font: normal ${props => props.selected ? '600' : 'normal'} 16px 'Inter', sans-serif;
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
    border: 10px solid #FFF;
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

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: ${props => props.$primary ? '#007bff' : '#6c757d'};
  color: white;
  &:hover {
    opacity: 0.9;
  }
`;

function AddTagToContent({ contentId, onClose, onSave }) {
  const { getTags, tags, addTagToContent, getTagsForContent } = useTagStore();
  const { authStatus: { user } } = useAuthStore();
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [existingTags, setExistingTags] = React.useState([]);
  const [availableTags, setAvailableTags] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // First useEffect: Fetch all tags and content tags
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      await getTags();
      const response = await getTagsForContent(contentId);
      if (response.success) {
        setExistingTags(response.data.map(tag => tag._id));
      }
      setIsLoading(false);
    };
    fetchTags();
  }, [contentId, getTags, getTagsForContent]);

  // Second useEffect: Filter available tags whenever tags or existingTags change
  useEffect(() => {
    setAvailableTags(tags.filter(tag => !existingTags.includes(tag._id)));
  }, [tags, existingTags]);

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    try {
      for (const tagId of selectedTags) {
        await addTagToContent(contentId, tagId, user._id);
      }
      if (onSave) {
        onSave(); // Trigger refresh in parent
      }
      onClose();
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <h4>Select Tags</h4>
        <TagGrid>
          {isLoading ? (
            <img src="/images/spinner.gif" alt="Loading..." style={{ margin: 'auto' }} />
          ) : availableTags.length > 0 ? (
            availableTags.map(tag => (
              <TagItem 
                key={tag._id}
                selected={selectedTags.includes(tag._id)}
                onClick={() => handleTagClick(tag._id)}
              >
                {tag.name}
              </TagItem>
            ))
          ) : (
            <div>All available tags have been added to this content.</div>
          )}
        </TagGrid>
        <ButtonRow>
          <Button onClick={onClose}>Cancel</Button>
          <Button $primary onClick={handleSave}>Save</Button>
        </ButtonRow>
      </PopupContent>
    </PopupOverlay>
  );
}

export default AddTagToContent;