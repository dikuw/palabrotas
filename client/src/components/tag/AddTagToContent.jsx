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
`;

const TagItem = styled.div`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  background: ${props => props.selected ? '#e0e0e0' : 'white'};
  &:hover {
    background: #f0f0f0;
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
        <h3>Select Tags</h3>
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