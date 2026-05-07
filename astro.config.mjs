import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://opc.ourai.ws',
  vite: {
    define: {
      SITE_TITLE: JSON.stringify('OurAI OPC'),
    },
    plugins: [tailwindcss()],
  },
});