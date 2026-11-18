import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import routeMeta from './build/routeMeta';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    routeMeta(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Saurabh Lokhande — AI Engineer Portfolio',
        short_name: 'Saurabh.AI',
        description: 'AI Engineer & Generative AI Specialist Portfolio',
        theme_color: '#020202',
        background_color: '#020202',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/],
        // Cache Google Fonts
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-stylesheets', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-webfonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'unsplash-images', expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 } }
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    cssCodeSplit: true,
    // Don't inject modulepreload polyfill — all target browsers support it natively
    modulePreload: { polyfill: false },
    // Inline assets ≤ 4 KB directly into JS bundles to save round-trips
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn'],
      },
    },
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Path-based chunking: only code that physically lives in a package
        // goes into its vendor chunk. (The object form also pulled shared
        // helpers into vendor-three, which forced the 200 KB three.js chunk
        // to be preloaded on every page — even on mobile, which never renders 3D.)
        manualChunks(id: string) {
          // Tiny helpers shared across every chunk (Vite preload, CJS interop, Babel runtime)
          // must live in an always-loaded chunk, or Rollup co-locates them with
          // whichever heavy vendor chunk imported them first.
          // (Vite module ids always use forward slashes, even on Windows.)
          if (id.includes('commonjsHelpers') || id.includes('preload-helper') || id.includes('/node_modules/@babel/runtime/')) {
            return 'vendor-react';
          }
          if (!id.includes('node_modules')) return undefined;
          const groups: Record<string, RegExp> = {
            'vendor-react': /\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler|@remix-run)\//,
            'vendor-framer': /\/node_modules\/(framer-motion|motion-dom|motion-utils)\//,
            'vendor-gsap': /\/node_modules\/gsap\//,
            'vendor-markdown': /\/node_modules\/(react-markdown|rehype-highlight|highlight\.js|lowlight|remark-\w[\w-]*|rehype-\w[\w-]*|mdast-\w[\w-]*|hast-\w[\w-]*|micromark[\w-]*|unified|unist-\w[\w-]*|vfile[\w-]*)\//,
            'vendor-icons': /\/node_modules\/lucide-react\//,
            'vendor-seo': /\/node_modules\/react-helmet-async\//,
            'vendor-three': /\/node_modules\/(three|@react-three|three-stdlib|three-mesh-bvh|troika-[\w-]+|camera-controls|maath|meshline|stats-gl|@monogrid)\//,
          };
          for (const [name, re] of Object.entries(groups)) if (re.test(id)) return name;
          return undefined;
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {},
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
