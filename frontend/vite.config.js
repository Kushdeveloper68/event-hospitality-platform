import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt', // user ko "Update available" dikhayenge (data loss se bachne ke liye)
      includeAssets: [
        'apple-touch-icon.png',
        'event-logo-with-icon-dark-bg-removebg-preview.png',
      ],
      manifest: {
        id: '/',
        name: 'EventCure',
        short_name: 'EventCure',
        description:
          'Live operations workspace for event teams: guest arrivals, rooms, transport and service requests.',
        lang: 'en-IN',
        start_url: '/dashboard',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#060609',
        theme_color: '#032f1e',
        categories: ['business', 'productivity'],
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Dashboard', url: '/dashboard', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Events', url: '/events', icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Sirf app shell precache hoga (JS/CSS/HTML/icons). Badi images (landing-page.png etc.) nahi.
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}', 'pwa-*.png', 'apple-touch-icon.png'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        // Backend API, Google OAuth aur auth callbacks kabhi SW se intercept nahi honge
        navigateFallbackDenylist: [/^\/api/, /^\/users\/auth/, /^\/auth\//, /\.(?:xml|txt)$/],
        cleanupOutdatedCaches: true,
        // API / OAuth ke liye koi runtime rule nahi hai, matlab wo hamesha seedha network se jayenge.
        // Sirf Google Fonts cache hote hain taaki repeat visits fast ho.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-styles' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: false,
  },
})
