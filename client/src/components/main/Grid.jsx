import React from 'react';
import { useContentStore } from '../../store/content';
import ContentGrid from './ContentGrid';
import NoResults from './NoResults';

export default function Grid() {
  const { contents, isSearching, searchResults } = useContentStore();
  
  const displayContents = searchResults.length > 0 ? searchResults : contents;

  if (isSearching && searchResults.length === 0) {
    return (
      <NoResults />
    );
  }

  return <ContentGrid contents={displayContents} showEditIcon={false} />;
}