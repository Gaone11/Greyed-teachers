# GreyEd PWA Implementation Guide

## Overview

Your GreyEd application is now configured as a Progressive Web App (PWA), making it installable on desktop and mobile devices with offline capabilities, push notifications, and native-like experience.

## Files Created/Modified

### 1. Manifest File
**Location:** `/public/manifest.json`

The manifest defines your app's appearance and behavior when installed:

- **Name:** GreyEd - El AI Tutoring Platform
- **Short Name:** GreyEd
- **Theme Color:** `#212754` (GreyEd Navy)
- **Background Color:** `#efeae4` (GreyEd White)
- **Display Mode:** Standalone (hides browser UI)
- **Orientation:** Portrait-primary (optimized for mobile)

**Key Features:**
- App shortcuts for quick access to Dashboard, Chat, Practice, and Teacher Portal
- Share target API for sharing content to your app
- Comprehensive icon support (SVG, PNG at 192x192 and 512x512)
- Screenshot metadata for app stores
- Category tags: education, productivity, lifestyle

### 2. Service Worker
**Location:** `/public/sw.js`

The service worker provides offline functionality and caching strategies:

**Caching Strategies:**
- **Fonts:** Cache-first (instant load, rare updates)
- **Images:** Cache-first (fast display, offline access)
- **API calls:** Network-first (fresh data when online)
- **Static assets (JS/CSS):** Cache-first (performance)
- **Default:** Network-first (balanced approach)

**Features:**
- Automatic cache versioning (`greyed-v1.0.0`)
- Smart cache invalidation on updates
- Offline fallback for documents
- Push notification support
- Background sync capabilities

### 3. HTML Updates
**Location:** `/index.html`

Enhanced with comprehensive PWA meta tags:

- Manifest link
- Apple touch icons
- Theme color meta tags
- Mobile-optimized viewport
- Apple web app capable settings
- Social media Open Graph tags
- Twitter Card metadata

### 4. Service Worker Registration
**Location:** `/src/main.tsx`

Automatic service worker registration with:
- Update detection
- User notification for new versions
- Automatic reload on update confirmation

## Icon Requirements

Your PWA needs the following icon files in the `/public` directory:

### Required Icons

1. **icon-192.png** - 192x192px
   - Standard icon for Android and desktop
   - Should have padding for safe area

2. **icon-512.png** - 512x512px
   - High-resolution icon for Android splash screens
   - Should have padding for safe area

3. **icon-maskable-192.png** - 192x192px
   - Adaptive icon for Android
   - Icon should fill entire canvas (no padding)
   - Critical content in center 80% circle

4. **icon-maskable-512.png** - 512x512px
   - High-res adaptive icon
   - Same guidelines as 192px version

### Icon Design Guidelines

**Standard Icons (192.png, 512.png):**
```
Recommended padding: 10% on all sides
Safe zone: Center 80%
Background: Transparent or #212754 (GreyEd Navy)
Content: GreyEd logo with clear visibility
```

**Maskable Icons (maskable-192.png, maskable-512.png):**
```
No padding - icon bleeds to edges
Critical content within center 80% circle
Background: Solid color (#212754 recommended)
Content: Centered GreyEd logo
Test with: https://maskable.app/
```

### Generating Icons

You can generate all required icon sizes from your SVG logo:

**Using ImageMagick:**
```bash
# From SVG to PNG
convert -background transparent favicon.svg -resize 192x192 icon-192.png
convert -background transparent favicon.svg -resize 512x512 icon-512.png

# Maskable versions (with background)
convert -background "#212754" favicon.svg -resize 192x192 icon-maskable-192.png
convert -background "#212754" favicon.svg -resize 512x512 icon-maskable-512.png
```

**Using Online Tools:**
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [Maskable Icon Editor](https://maskable.app/editor)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Screenshot Requirements

For app store listings (optional but recommended):

**Desktop Screenshot:**
- **Filename:** `/public/screenshots/desktop-home.png`
- **Size:** 1280x720px
- **Content:** Homepage or dashboard view
- **Format:** PNG

**Mobile Screenshot:**
- **Filename:** `/public/screenshots/mobile-dashboard.png`
- **Size:** 750x1334px (iPhone 6/7/8 Plus size)
- **Content:** Student dashboard mobile view
- **Format:** PNG

## Testing Your PWA

### 1. Local Testing

**Run Development Server:**
```bash
npm run dev
```

**Build and Preview:**
```bash
npm run build
npm run preview
```

### 2. Chrome DevTools Audit

1. Open your app in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select "Progressive Web App"
5. Click "Analyze page load"

**Target Scores:**
- PWA: 100%
- Performance: 90+%
- Accessibility: 95+%
- Best Practices: 95+%
- SEO: 100%

### 3. Application Tab Check

In Chrome DevTools → Application tab, verify:

**Manifest:**
- ✅ Manifest loads correctly
- ✅ All icons are valid
- ✅ Theme colors display properly
- ✅ Name and short_name are correct

**Service Workers:**
- ✅ Service worker registers successfully
- ✅ Status shows "activated and running"
- ✅ Can update on reload

**Storage:**
- ✅ Cache storage shows precached files
- ✅ Runtime cache populates on navigation

### 4. Install Test

**Desktop (Chrome/Edge):**
1. Look for install icon in address bar
2. Click to install
3. App opens in standalone window
4. Check start menu/dock for app icon

**Mobile (Android Chrome):**
1. Tap menu → "Add to Home screen"
2. Confirm installation
3. App icon appears on home screen
4. Opens in fullscreen without browser UI

**iOS Safari:**
1. Tap Share button
2. Select "Add to Home Screen"
3. Confirm with custom name/icon
4. App icon on home screen
5. Opens with custom splash screen

### 5. Offline Test

1. Install the app
2. Open DevTools → Network tab
3. Switch to "Offline" mode
4. Navigate around the app
5. Verify cached pages load
6. Check fallback for uncached pages

## Verification Checklist

Use this checklist to ensure complete PWA implementation:

### Manifest
- [ ] `/public/manifest.json` exists and is valid
- [ ] Linked in `index.html` with `<link rel="manifest">`
- [ ] All required fields present (name, short_name, start_url, display, icons)
- [ ] Theme color matches brand (#212754)
- [ ] Icons array includes 192px and 512px sizes
- [ ] Maskable icons available for adaptive support

### Icons
- [ ] `/public/icon-192.png` exists
- [ ] `/public/icon-512.png` exists
- [ ] `/public/icon-maskable-192.png` exists
- [ ] `/public/icon-maskable-512.png` exists
- [ ] All icons are properly formatted PNG files
- [ ] Icons display correctly in browsers

### Service Worker
- [ ] `/public/sw.js` exists
- [ ] Service worker registers in `main.tsx`
- [ ] Cache name uses versioning system
- [ ] Precache includes critical assets
- [ ] Caching strategies implemented
- [ ] Update detection working
- [ ] Offline fallback functional

### HTML Meta Tags
- [ ] Manifest linked in head
- [ ] Theme color meta tag present
- [ ] Apple touch icons linked
- [ ] Apple mobile web app capable
- [ ] Viewport includes viewport-fit=cover
- [ ] Open Graph tags complete
- [ ] Twitter Card metadata present

### Functionality
- [ ] App installs on desktop
- [ ] App installs on Android
- [ ] App installs on iOS
- [ ] Standalone display mode works
- [ ] Offline mode functional
- [ ] Cache updates properly
- [ ] Push notifications supported (if using)
- [ ] Shortcuts work from home screen

### Performance
- [ ] Lighthouse PWA score 100%
- [ ] Fast initial load (< 3s)
- [ ] Service worker caches efficiently
- [ ] No console errors
- [ ] Smooth offline → online transition

## Deployment Checklist

Before deploying your PWA:

### 1. HTTPS Required
- [ ] Site served over HTTPS (required for service workers)
- [ ] SSL certificate valid
- [ ] Mixed content resolved

### 2. Domain Configuration
- [ ] Update `start_url` in manifest.json to your domain
- [ ] Update Open Graph URLs in index.html
- [ ] Update any hardcoded URLs in service worker

### 3. Icons and Assets
- [ ] All icon files uploaded to production
- [ ] Screenshots uploaded (if using)
- [ ] Favicon.svg in place
- [ ] og-image.png exists for social sharing

### 4. Service Worker
- [ ] Service worker accessible at /sw.js
- [ ] Cache names updated for production
- [ ] Console logs removed or conditional

### 5. Testing
- [ ] Test installation on real devices
- [ ] Verify offline functionality
- [ ] Check update mechanism
- [ ] Test app shortcuts
- [ ] Validate manifest in production

## Browser Support

Your PWA is supported on:

**Fully Supported:**
- Chrome 90+ (Desktop & Android)
- Edge 90+
- Samsung Internet 14+
- Opera 76+

**Partial Support:**
- Safari 15+ (iOS & macOS)
  - No push notifications on iOS
  - Limited service worker features
  - Add to Home Screen available

**Not Supported:**
- Internet Explorer (all versions)
- Firefox (limited PWA features)

## Common Issues & Solutions

### Issue: Service Worker Not Registering

**Symptoms:**
- Console error: "Failed to register service worker"
- No service worker in DevTools Application tab

**Solutions:**
1. Ensure site is served over HTTPS (or localhost)
2. Check `/public/sw.js` exists and is accessible
3. Verify no JavaScript errors preventing registration
4. Clear browser cache and reload

### Issue: Manifest Not Loading

**Symptoms:**
- Console warning: "Manifest could not be fetched"
- No install prompt appearing

**Solutions:**
1. Check manifest link in index.html is correct
2. Verify `/public/manifest.json` exists
3. Ensure manifest is valid JSON (use validator)
4. Check MIME type is `application/manifest+json`

### Issue: Icons Not Displaying

**Symptoms:**
- Default browser icon shows instead of custom icon
- Install prompt shows placeholder

**Solutions:**
1. Verify all icon files exist in `/public` directory
2. Check icon paths in manifest.json are correct
3. Ensure icon files are valid PNG format
4. Test with minimum 192x192 icon first
5. Clear cache and test again

### Issue: Offline Mode Not Working

**Symptoms:**
- White screen when offline
- "No internet" browser error

**Solutions:**
1. Check service worker is activated
2. Verify caching strategy in sw.js
3. Ensure critical assets in precache list
4. Test with Network → Offline in DevTools
5. Check console for fetch errors

### Issue: Update Not Detecting

**Symptoms:**
- Changes not appearing after deploy
- Old version still running

**Solutions:**
1. Update cache version in sw.js (e.g., `greyed-v1.0.1`)
2. Trigger update: DevTools → Application → Service Workers → Update
3. Clear all caches manually if needed
4. Unregister old service worker and refresh

## Advanced Features

### Push Notifications

Your service worker includes push notification handlers. To enable:

1. Request notification permission:
```javascript
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // Subscribe to push service
  }
});
```

2. Subscribe to push notifications using your backend
3. Send notifications from server using Web Push protocol

### Background Sync

For syncing data when connection restored:

```javascript
// In your app
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('sync-data');
});

// In sw.js
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncDataToServer());
  }
});
```

### Share Target API

Your manifest includes share target configuration. Handle shared content:

```javascript
// In your app at /share route
const urlParams = new URLSearchParams(window.location.search);
const sharedTitle = urlParams.get('title');
const sharedText = urlParams.get('text');
const sharedUrl = urlParams.get('url');
```

## Maintenance

### Updating Your PWA

When deploying updates:

1. **Increment cache version** in `sw.js`:
```javascript
const CACHE_NAME = 'greyed-v1.0.1'; // Increment version
```

2. **Deploy changes** to production

3. **Users will see update prompt** automatically

4. **Clear old caches** happen automatically via activate event

### Monitoring

Track PWA metrics:

- Install rate (how many users install)
- Engagement (time in standalone mode)
- Offline usage patterns
- Update adoption rate
- Cache hit/miss ratio

## Resources

**Testing & Validation:**
- [PWA Builder](https://www.pwabuilder.com/) - Test and improve your PWA
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing
- [Workbox](https://developers.google.com/web/tools/workbox) - Advanced service worker toolkit

**Documentation:**
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [W3C Web App Manifest](https://www.w3.org/TR/appmanifest/)

**Tools:**
- [Manifest Generator](https://app-manifest.firebaseapp.com/)
- [Icon Generator](https://realfavicongenerator.net/)
- [Service Worker Cookbook](https://serviceworke.rs/)

## Support

For issues or questions about the PWA implementation:

1. Check the troubleshooting section above
2. Review browser console for errors
3. Use Chrome DevTools → Application tab
4. Test in Lighthouse for specific recommendations

## Version History

- **v1.0.0** - Initial PWA implementation
  - Manifest configuration
  - Service worker with caching strategies
  - Install prompts
  - Offline support
  - App shortcuts
  - Share target API

---

**Last Updated:** 2025
**Maintained By:** GreyEd Development Team
