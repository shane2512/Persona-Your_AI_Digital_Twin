import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    proxy: {
      // Proxy for reflection generation - handle both Bolt and local dev
      '/api/get-advice': {
        target: process.env.NODE_ENV === 'development' && process.env.NETLIFY_DEV 
          ? 'http://localhost:8888' 
          : 'https://persona-mirror-ai.netlify.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/get-advice/, '/.netlify/functions/get-advice'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error for /api/get-advice:', err.message);
            // Send a fallback response instead of letting the proxy fail
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Claude service temporarily unavailable',
                fallback: true 
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying Claude reflection request:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Claude reflection proxy response:', proxyRes.statusCode, 'for', req.url);
          });
        }
      },
      // Proxy for chat functionality
      '/api/chat': {
        target: process.env.NODE_ENV === 'development' && process.env.NETLIFY_DEV 
          ? 'http://localhost:8888' 
          : 'https://persona-mirror-ai.netlify.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, '/.netlify/functions/chat'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error for /api/chat:', err.message);
            // Send a fallback response instead of letting the proxy fail
            if (res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                response: "I'm Claude, and I'm currently having connection issues, but I'm here to help you reflect. What's on your mind?",
                fallback: true 
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying Claude chat request:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Claude chat proxy response:', proxyRes.statusCode, 'for', req.url);
          });
        }
      }
    }
  },
});