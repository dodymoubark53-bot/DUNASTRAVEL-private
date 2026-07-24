import { defineConfig } from 'vite'
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
export default defineConfig({
  plugins: [react(), asyncCssPlugin()],
  base: '/',
  server: {
    watch: {
      ignored: ['**/.claude/**', '**/.git/**']
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) return 'vendor-i18n';
          if (id.includes('node_modules/react-icons')) return 'vendor-icons';
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          if (id.includes('node_modules/react-helmet-async')) return 'vendor-helmet';
        },
      },
    },
    chunkSizeWarningLimit: 400,
    cssCodeSplit: true,
    sourcemap: false,
  },
})
