// Google Tag Manager Configuration
export const GTM_CONFIG = {
  // Production GTM IDs (array to support multiple containers)
  production: ['GTM-N5D4J5V'] as string[],
  // Development/Testing GTM IDs (optional)
  development: ['GTM-N5D4J5V'] as string[], // You can use the same IDs or create separate test containers
  // Staging GTM IDs (optional)
  staging: ['GTM-N5D4J5V'] as string[], // You can use the same IDs or create separate staging containers
};

// Google Tag (gtag.js) Configuration
export const GOOGLE_TAG_CONFIG = {
  // Google Ads conversion tracking ID
  googleAdsId: 'AW-356769217',
} as const;

// Get the appropriate GTM IDs based on environment
export function getGTMIds(): string[] {
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

// Get the first GTM ID for backward compatibility
export function getGTMId(): string {
  return getGTMIds()[0];
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
