import React from 'react';
import ContentGrid from '../main/ContentGrid';

export default function AccountGrid({ contents }) {
  return <ContentGrid contents={contents} showEditIcon={true} />;
}