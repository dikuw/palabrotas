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
  font: normal 16px sans-serif;
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
    border: 10px solid #fff;
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

function AddTagToContent({ contentId, onClose }) {
  const { getTags, tags, addTagToContent } = useTagStore();
  const { authStatus: { user } } = useAuthStore();
  const [selectedTags, setSelectedTags] = React.useState([]);

  useEffect(() => {
    getTags();
  }, []);

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    for (const tagId of selectedTags) {
      await addTagToContent(contentId, tagId, user._id);
    }
    onClose();
  };

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <h4>Select Tags</h4>
        <TagGrid>
          {tags.map(tag => (
            <TagItem 
              key={tag._id}
              selected={selectedTags.includes(tag._id)}
              onClick={() => handleTagClick(tag._id)}
            >
              {tag.name}
            </TagItem>
          ))}
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