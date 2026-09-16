/**
 * Helper to handle Google Drive image links and convert them into directly displayable image URLs.
 * Google Drive share links (e.g. /file/d/.../view or id=...) return an HTML page, which fails inside <img />.
 * Converting to https://lh3.googleusercontent.com/d/FILE_ID or https://drive.google.com/thumbnail?id=FILE_ID
 * allows the browser to display the image directly with full performance.
 */

export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchId && matchId[1]) return matchId[1];

  // Pattern 3: /d/FILE_ID
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchD && matchD[1]) return matchD[1];

  return null;
}

export function formatGoogleDriveUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    // Google User Content CDN directly streams the image
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  return trimmed;
}

export function getGoogleDriveFallbackUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  }
  return url;
}