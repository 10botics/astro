export const ATTRIBUTION_STORAGE_KEY = '10botics_marketing_attribution_v1';
export const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];

export type MarketingAttribution = Record<AttributionField, string> & {
  landing_page: string;
  referrer: string;
  captured_at: number;
  expires_at: number;
};

function emptyFields(): Record<AttributionField, string> {
  return Object.fromEntries(ATTRIBUTION_FIELDS.map((field) => [field, ''])) as Record<
    AttributionField,
    string
  >;
}

function isExternalReferrer(referrer: string, currentUrl: string): boolean {
  if (!referrer) return false;
  try {
    return new URL(referrer).origin !== new URL(currentUrl).origin;
  } catch {
    return false;
  }
}

function attributionFromPage(currentUrl: string, referrer: string, now: number): MarketingAttribution {
  const url = new URL(currentUrl);
  const fields = emptyFields();
  for (const field of ATTRIBUTION_FIELDS) fields[field] = url.searchParams.get(field) || '';
  return {
    ...fields,
    landing_page: url.href,
    referrer: isExternalReferrer(referrer, url.href) ? referrer : '',
    captured_at: now,
    expires_at: now + ATTRIBUTION_TTL_MS,
  };
}

function isValid(value: unknown, now: number): value is MarketingAttribution {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<MarketingAttribution>;
  return (
    typeof candidate.landing_page === 'string' &&
    typeof candidate.referrer === 'string' &&
    typeof candidate.captured_at === 'number' &&
    typeof candidate.expires_at === 'number' &&
    candidate.expires_at > now &&
    ATTRIBUTION_FIELDS.every((field) => typeof candidate[field] === 'string')
  );
}

function readStored(now = Date.now()): MarketingAttribution | null {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (isValid(parsed, now)) return parsed;
    window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
  } catch {
    // Storage may be disabled or contain malformed data. Attribution stays best-effort.
  }
  return null;
}

function writeStored(attribution: MarketingAttribution): void {
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Forms and WhatsApp remain available when storage is disabled.
  }
}

export function hasCampaignTag(url: URL): boolean {
  return ATTRIBUTION_FIELDS.some((field) => Boolean(url.searchParams.get(field)));
}

/** Capture the latest tagged acquisition, or the first untagged landing when none exists. */
export function captureMarketingAttribution(
  currentUrl = window.location.href,
  referrer = document.referrer,
  now = Date.now(),
): MarketingAttribution {
  const current = attributionFromPage(currentUrl, referrer, now);
  const stored = readStored(now);
  if (hasCampaignTag(new URL(currentUrl)) || !stored) {
    writeStored(current);
    return current;
  }
  return stored;
}

export function getMarketingAttribution(): MarketingAttribution {
  return captureMarketingAttribution();
}

/** Remove campaign identifiers from URLs displayed or sent in WhatsApp text. */
export function cleanPublicPageUrl(href: string): string {
  const trimmed = (href || '').trim();
  if (!trimmed) return '';
  try {
    const url = new URL(trimmed, window.location.origin);
    for (const field of ATTRIBUTION_FIELDS) url.searchParams.delete(field);
    url.searchParams.delete('ref');
    return url.href;
  } catch {
    return trimmed;
  }
}
