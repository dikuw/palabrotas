import React from 'react';
import { useContentStore } from '../../store/content';
import ContentGrid from './ContentGrid';

export default function Grid() {
  const { contents, searchResults } = useContentStore();
  
  const displayContents = searchResults.length > 0 ? searchResults : contents;

  return <ContentGrid contents={displayContents} showEditIcon={false} />;
}