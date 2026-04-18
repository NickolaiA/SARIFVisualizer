/**
 * Sanitizes a URL by only allowing http: and https: protocols.
 * Returns '#' for any URL with an unsafe protocol (e.g. javascript:, data:, vbscript:),
 * for relative URLs, or for malformed URLs.
 * Only absolute URLs with http: or https: protocols are supported.
 * Returns the normalized URL (parsed.href) to prevent encoding-based bypasses.
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
    // invalid or relative URL
  }
  return '#';
};
