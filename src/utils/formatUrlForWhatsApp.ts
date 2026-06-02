/**
 * Encode a page URL for embedding in WhatsApp prefilled text:
 * path segments use encodeURIComponent (spaces → %20, unicode preserved as %XX).
 */
export function formatUrlForWhatsAppMessage(href: string): string {
  const trimmed = (href || '').trim();
  if (!trimmed) return '';

  try {
    const u = new URL(trimmed);
    const encodedPath = u.pathname
      .split('/')
      .map((segment) => {
        if (segment === '') return '';
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch {
          return encodeURIComponent(segment);
        }
      })
      .join('/');
    let result = `${u.protocol}//${u.host}${encodedPath}`;
    if (u.search) result += u.search;
    if (u.hash) result += u.hash;
    return result;
  } catch {
    return trimmed.replace(/ /g, '%20');
  }
}
