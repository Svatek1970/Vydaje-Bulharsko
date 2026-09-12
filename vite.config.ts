import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Nech funguje aj počas `npm run dev`, nielen po builde
      devOptions: { enabled: true },
      manifest: {
        name: 'Výdavky Bulharsko',
        short_name: 'Výdavky',
        description: 'Sledovanie spoločných nákladov zo skupinového výletu',
        lang: 'sk',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#f4f4f5',
        theme_color: '#18181b',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Predcachuje celú appku (HTML/JS/CSS/ikony), nech beží aj úplne offline
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
