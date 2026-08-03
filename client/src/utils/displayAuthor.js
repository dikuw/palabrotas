/**
 * Display name for content authorship.
 * Prefers the live owner name so deleted accounts show "Deleted User"
 * even if the denormalized `author` string is stale.
 */
export function displayAuthor(content) {
  if (!content) return '';
  if (content.owner?.status === 'deleted' || content.owner?.name === 'Deleted User') {
    return 'Deleted User';
  }
  return content.owner?.name || content.author || '';
}
