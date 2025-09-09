# Google Tag Manager Integration Guide for Astro

This guide explains how Google Tag Manager (GTM) is integrated into your Astro project and how to manage it effectively.

## Current Implementation

Your Astro project now has a robust Google Tag Manager implementation with the following features:

### 1. Reusable Components

- **`GoogleTagManager.astro`**: Handles the main GTM script in the `<head>`
- **`GoogleTagManagerNoscript.astro`**: Provides fallback for users with JavaScript disabled
- **`gtm-config.ts`**: Environment-based configuration management

### 2. Environment-Based Configuration

The GTM implementation automatically adapts based on your environment:

- **Production**: Uses your production GTM container ID
- **Staging**: Uses your staging GTM container ID (if different)
- **Development**: Uses your development GTM container ID (if different)

### 3. Conditional Loading

GTM only loads when enabled, which is useful for:
- Development environments where you don't want tracking
- A/B testing different GTM configurations
- Compliance with privacy regulations

## File Structure

```
src/
├── components/
│   ├── GoogleTagManager.astro          # Main GTM script component
│   └── GoogleTagManagerNoscript.astro  # Noscript fallback component
├── layouts/
│   └── Layout.astro                    # Main layout with GTM integration
└── utils/
    └── gtm-config.ts                   # GTM configuration management
```

## Configuration

### GTM Container IDs

Edit `src/utils/gtm-config.ts` to set your GTM container IDs:

```typescript
export const GTM_CONFIG = {
  production: 'GTM-XXXXXXX',  // Your production GTM ID
  development: 'GTM-YYYYYYY', // Your development GTM ID (optional)
  staging: 'GTM-ZZZZZZZ',     // Your staging GTM ID (optional)
} as const;
```

### Environment Variables

You can control GTM behavior using environment variables:

```bash
# .env
GTM_ENABLED=true  # Force enable/disable GTM regardless of environment
```

## How It Works

### 1. Data Layer Initialization

The GTM script initializes the data layer before loading the main GTM script:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
```

### 2. Main GTM Script

The main GTM script loads asynchronously and pushes the start event:

```javascript
(function(w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  // ... script loading logic
})(window, document, 'script', 'dataLayer', 'GTM-XXXXXXX');
```

### 3. Noscript Fallback

For users with JavaScript disabled, an iframe fallback is provided:

```html
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
```

## Best Practices

### 1. Astro-Specific Considerations

- **`is:inline` directive**: All GTM scripts use `is:inline` to prevent Astro from optimizing them
- **Component-based**: GTM is implemented as reusable components for better maintainability
- **Environment-aware**: Different GTM containers can be used for different environments

### 2. Performance

- **DNS Prefetch**: Consider adding DNS prefetch for GTM domains
- **Async Loading**: GTM scripts load asynchronously to avoid blocking page rendering
- **Conditional Loading**: GTM only loads when needed

### 3. Privacy Compliance

- **Cookie Consent**: Ensure you have proper cookie consent mechanisms
- **Data Layer**: Use the data layer for custom events and variables
- **GDPR Compliance**: Consider implementing consent management

## Testing

### 1. GTM Preview Mode

1. Go to your GTM container
2. Click "Preview" to enter preview mode
3. Enter your website URL
4. Verify that tags are firing correctly

### 2. Browser Developer Tools

1. Open browser developer tools
2. Check the Network tab for GTM requests
3. Verify the data layer in the Console:
   ```javascript
   console.log(window.dataLayer);
   ```

### 3. Google Tag Assistant

Use [Google Tag Assistant](https://tagassistant.google.com/) to verify your implementation.

## Custom Events

You can push custom events to the data layer:

```javascript
// In your Astro components or pages
<script>
  // Push custom event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'custom_event',
    'custom_parameter': 'value'
  });
</script>
```

## Troubleshooting

### Common Issues

1. **GTM not loading**: Check if `gtmEnabled` is true and GTM ID is correct
2. **Script errors**: Ensure all scripts use `is:inline` directive
3. **Data layer issues**: Verify data layer initialization is before GTM script

### Debug Mode

Enable debug mode by adding this to your GTM configuration:

```typescript
// In gtm-config.ts
export const GTM_CONFIG = {
  // ... your config
  debug: import.meta.env.DEV // Enable debug in development
};
```

## Migration from Direct Implementation

If you had GTM implemented directly in your layout before, the new component-based approach provides:

- Better maintainability
- Environment-based configuration
- Reusable components
- Cleaner code organization

## Next Steps

1. **Configure GTM Container**: Set up your GTM container with the appropriate tags
2. **Test Implementation**: Use GTM preview mode to test your setup
3. **Add Custom Events**: Implement custom tracking events as needed
4. **Privacy Compliance**: Ensure your implementation complies with privacy regulations

## Resources

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [Astro Scripts Documentation](https://docs.astro.build/en/guides/client-side-scripts/)
- [GTM Best Practices](https://support.google.com/tagmanager/answer/6107163)
