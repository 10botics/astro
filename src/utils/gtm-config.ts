// Google Tag Manager Configuration
export const GTM_CONFIG = {
  // Production GTM ID
  production: 'GTM-N5D4J5V',
  // Development/Testing GTM ID (optional)
  development: 'GTM-N5D4J5V', // You can use the same ID or create a separate test container
  // Staging GTM ID (optional)
  staging: 'GTM-N5D4J5V', // You can use the same ID or create a separate staging container
} as const;

// Google Tag (gtag.js) Configuration
export const GOOGLE_TAG_CONFIG = {
  // Google Ads conversion tracking ID
  googleAdsId: 'AW-356769217',
} as const;

// Get the appropriate GTM ID based on environment
export function getGTMId(): string {
  const env = import.meta.env.MODE || 'development';
  
  switch (env) {
    case 'production':
      return GTM_CONFIG.production;
    case 'staging':
      return GTM_CONFIG.staging;
    case 'development':
    default:
      return GTM_CONFIG.development;
  }
}

// Check if GTM should be enabled (useful for development)
export function isGTMEnabled(): boolean {
  const env = import.meta.env.MODE || 'development';
  const gtmEnabled = import.meta.env.GTM_ENABLED;
  
  // If GTM_ENABLED is explicitly set, use that value
  if (gtmEnabled !== undefined) {
    return gtmEnabled === 'true';
  }
  
  // Enable for all environments (production, staging, and development)
  return true;
}

// Check if Google Tag should be enabled (useful for development)
export function isGoogleTagEnabled(): boolean {
  const env = import.meta.env.MODE || 'development';
  const googleTagEnabled = import.meta.env.GOOGLE_TAG_ENABLED;
  
  // If GOOGLE_TAG_ENABLED is explicitly set, use that value
  if (googleTagEnabled !== undefined) {
    return googleTagEnabled === 'true';
  }
  
  // Enable for all environments (production, staging, and development)
  return true;
}
