import { API_URL } from './config';

export function isRemoteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}

export function isLocalMediaUri(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  const uri = value.trim();
  return (
    uri.startsWith('file://')
    || uri.startsWith('content://')
    || uri.startsWith('ph://')
    || uri.startsWith('assets-library://')
  );
}

export function extractMediaPath(url) {
  if (typeof url !== 'string' || !url.trim()) return null;
  const match = url.trim().match(/\/media\/(?:videos|images)\/[^/?#]+/i);
  return match ? match[0] : null;
}

export function isAppMediaUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  const trimmed = value.trim();
  if (trimmed.startsWith('/media/')) return true;
  if (trimmed.startsWith(`${API_URL}/media/`)) return true;
  return extractMediaPath(trimmed) != null;
}

export function toBackendMediaPath(url) {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '';

  const mediaPath = extractMediaPath(trimmed);
  if (mediaPath) return mediaPath;

  if (trimmed.startsWith('/media/')) return trimmed;

  if (trimmed.startsWith(API_URL)) {
    const path = trimmed.slice(API_URL.length);
    return path.startsWith('/') ? path : `/${path}`;
  }

  return trimmed;
}

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const mediaPath = extractMediaPath(trimmed);
  if (mediaPath) return `${API_URL}${mediaPath}`;

  if (isRemoteUrl(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return `${API_URL}${trimmed}`;
  return trimmed;
}

export function normalizeVideoLinkInput(value) {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return '';
  if (!isRemoteUrl(trimmed)) {
    throw new Error('Informe um link válido (http:// ou https://)');
  }
  return trimmed;
}

export function guessMimeType(uri, kind) {
  const lower = (uri ?? '').toLowerCase();
  if (kind === 'video') {
    if (lower.includes('.mov')) return 'video/quicktime';
    if (lower.includes('.webm')) return 'video/webm';
    return 'video/mp4';
  }
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  return 'image/jpeg';
}

export function guessFileName(uri, kind) {
  const parts = (uri ?? '').split('/');
  const last = parts[parts.length - 1] || '';
  if (last.includes('.')) return last;
  return kind === 'video' ? 'video.mp4' : 'image.jpg';
}
