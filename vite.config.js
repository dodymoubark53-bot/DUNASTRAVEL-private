import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

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

// Development plugin to capture and save all browser runtime logs & errors to a local file
function devLoggerPlugin() {
  const logFilePath = path.resolve(process.cwd(), 'frontend_runtime.log');

  return {
    name: 'dev-runtime-logger',
    apply: 'serve',
    configureServer(server) {
      fs.writeFileSync(logFilePath, `=== Frontend Runtime Log Session Started: ${new Date().toISOString()} ===\n\n`, 'utf8');

      server.middlewares.use('/__client_log', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const time = new Date().toLocaleTimeString();
              const logEntry = `[${time}] [${data.type || 'LOG'}] ${data.message || ''}\n${data.stack ? '  Stack: ' + data.stack + '\n' : ''}${data.details ? '  Details: ' + JSON.stringify(data.details) + '\n' : ''}\n`;
              fs.appendFileSync(logFilePath, logEntry, 'utf8');
              const color = data.type && data.type.includes('ERROR') ? '\x1b[31m' : data.type && data.type.includes('WARN') ? '\x1b[33m' : '\x1b[36m';
              console.log(`${color}[BROWSER ${data.type}]\x1b[0m ${data.message || ''}`);
            } catch (e) {
              fs.appendFileSync(logFilePath, `[${new Date().toLocaleTimeString()}] ${body}\n`, 'utf8');
            }
            res.statusCode = 200;
            res.end('OK');
          });
        } else {
          res.statusCode = 200;
          res.end('OK');
        }
      });
    },
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>
    <script>
      (function() {
        function sendLog(type, message, stack, details) {
          try {
            var payload = JSON.stringify({
              type: type,
              message: String(message || ''),
              stack: stack || null,
              details: details || null,
              url: window.location.pathname + window.location.search,
              time: new Date().toISOString()
            });
            if (navigator.sendBeacon) {
              navigator.sendBeacon('/__client_log', payload);
            } else {
              fetch('/__client_log', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' } });
            }
          } catch(e) {}
        }
        window.addEventListener('error', function(e) {
          sendLog('UNCAUGHT_ERROR', e.message, e.error ? e.error.stack : null, { filename: e.filename, lineno: e.lineno, colno: e.colno });
        });
        window.addEventListener('unhandledrejection', function(e) {
          sendLog('UNHANDLED_REJECTION', e.reason ? (e.reason.message || String(e.reason)) : 'Unknown rejection', e.reason ? e.reason.stack : null);
        });
        var origError = console.error;
        console.error = function() {
          var args = Array.prototype.slice.call(arguments);
          sendLog('CONSOLE_ERROR', args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
          origError.apply(console, arguments);
        };
        var origWarn = console.warn;
        console.warn = function() {
          var args = Array.prototype.slice.call(arguments);
          sendLog('CONSOLE_WARN', args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
          origWarn.apply(console, arguments);
        };
        console.log('[DevLogger] Live browser logging active. Output stored in frontend_runtime.log');
        sendLog('PAGE_NAVIGATE', 'Loaded ' + window.location.pathname);
      })();
    </script>`
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
    plugins: [react(), asyncCssPlugin(), devLoggerPlugin()],
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
            if (id.includes('node_modules/react-dom')) return 'vendor-react-dom';
            if (id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'vendor-react';
            if (id.includes('node_modules/react-router')) return 'vendor-router';
            if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
            if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next') || id.includes('node_modules/i18next-browser-languagedetector')) return 'vendor-i18n';
            if (id.includes('node_modules/react-icons/fa') || id.includes('node_modules/react-icons/fa6')) return 'vendor-icons-fa';
            if (id.includes('node_modules/react-icons')) return 'vendor-icons';
            if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'vendor-leaflet';
            if (id.includes('node_modules/react-helmet-async')) return 'vendor-helmet';
            if (id.includes('src/i18n/locales/')) {
              const match = id.match(/locales[\\/]([a-z]{2})\.json/);
              if (match) return `locale-${match[1]}`;
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      sourcemap: false,
    },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    fileParallelism: false,
  },
  };
})
