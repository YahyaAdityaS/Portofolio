/**
 * Helper utilities for generating unique IDs, formatting review data,
 * and computing statistics for client testimonials & reviews.
 */

export function generateReviewId(
  author: string,
  quote: string,
  timestamp?: string,
  fallbackIdx?: number
): string {
  const cleanAuthor = (author || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 16);
  const cleanQuote = (quote || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);
  const cleanTime = (timestamp || '').replace(/[^a-z0-9]/g, '').slice(-8);
  const suffix = cleanTime || (typeof fallbackIdx === 'number' ? `idx${fallbackIdx}` : '0');

  return `rev_${cleanAuthor}_${cleanQuote}_${suffix}`;
}

export function calculateAverageRating(
  reviews: Array<{ stars?: number; rating?: number }>
): number {
  if (!reviews || reviews.length === 0) return 5.0;
  const total = reviews.reduce((acc, curr) => acc + (curr.stars || curr.rating || 5), 0);
  return Number((total / reviews.length).toFixed(1));
}

export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'US';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'US';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}