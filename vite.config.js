import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to convert render-blocking CSS link tags to preloaded async link tags
function asyncCssPlugin() {
  return {
    name: 'async-css',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*?)>/g,
        '<link rel="preload" $1href="$2"$3 as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" $1href="$2"$3></noscript>'
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Keep local development fully integrated with the local Nest API. An
  // explicit VITE_API_URL still wins (useful for staging/remote testing),
  // while production builds retain the deployed API as their default.
  const upstreamApi = env.VITE_API_URL || (
    mode === 'development'
      ? 'http://localhost:5000/api'
      : 'https://dunastravel-backend-seven.vercel.app/api'
  );
  const apiOrigin = new URL(upstreamApi).origin;

  return {
    plugins: [react(), asyncCssPlugin()],
    base: '/',
    server: {
      watch: {
        ignored: ['**/.claude/**', '**/.git/**']
      },
      // Production API intentionally rejects localhost origins. Proxy local
      // browser requests through Vite so the app can be exercised locally
      // without weakening production CORS policy.
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next-browser-languagedetector')) return 'vendor-i18n';
          if (id.includes('node_modules/react-icons')) return 'vendor-icons';
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          if (id.includes('node_modules/leaflet')) return 'vendor-leaflet';
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-helmet';
          if (id.includes('src/i18n/locales/')) {
            const match = id.match(/locales[\\/]([a-z]{2})\.json/);
            if (match) return `locale-${match[1]}`;
          }
        },
      },
    },
    chunkSizeWarningLimit: 400,
    cssCodeSplit: true,
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  };
})
