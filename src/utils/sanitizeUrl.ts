/**
 * Sanitizes a URL by only allowing http: and https: protocols.
 * Returns '#' for any URL with an unsafe protocol (e.g. javascript:, data:, vbscript:)
 * or for malformed URLs.
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return url;
    }
  } catch {
    // invalid URL
  }
  return '#';
};
