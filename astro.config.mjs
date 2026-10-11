// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // La auditoría de la barra dev se reejecuta con cada cambio del DOM (el contador
  // cambia cada segundo) y vuelve a pedir todas las imágenes en local.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
