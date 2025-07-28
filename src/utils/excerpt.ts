/**
 * Generate excerpt from markdown content
 * @param content - Markdown content
 * @param maxLength - Maximum length of excerpt (default: 200)
 * @returns Clean excerpt without images or formatting
 */
export function generateExcerpt(content: string, maxLength: number = 200): string {
  if (!content) return '';
  
  // Remove markdown images
  let cleanContent = content.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // Remove markdown links but keep link text
  cleanContent = cleanContent.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove markdown formatting
  cleanContent = cleanContent.replace(/[#*`]/g, '');
  
  // Remove HTML tags
  cleanContent = cleanContent.replace(/<[^>]*>/g, '');
  
  // Replace multiple newlines and spaces with single space
  cleanContent = cleanContent.replace(/\s+/g, ' ').trim();
  
  // Truncate to maxLength, break at word boundary
  if (cleanContent.length > maxLength) {
    cleanContent = cleanContent.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
  }
  
  return cleanContent;
} 