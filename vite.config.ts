import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // GitHub Pages sirve el sitio bajo /<repo>/, así que las rutas de los assets deben ser relativas
  // a esa base. En desarrollo se queda en '/'.
  base: process.env.BASE_PATH ?? '/',
  build: {
    target: 'es2022',
    // Three.js supera los 500 kB sin comprimir y el aviso por defecto salta siempre. Aquí es
    // esperado: va en su propio chunk y solo lo descarga quien abre una de las 6 ideas en 3D.
    // Lo que sí vigilamos es el JS crítico, que debe quedar holgadamente por debajo de 200 kB.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: {
        // Un documento por idioma: los genera scripts/generar-html.mjs desde plantilla/index.html,
        // y no se editan a mano. Las otras dos son bancos de pruebas de desarrollo.
        principal: resolve(__dirname, 'index.html'),
        ingles: resolve(__dirname, 'en/index.html'),
        prototipos: resolve(__dirname, 'prototipos.html'),
        galeria: resolve(__dirname, 'galeria.html'),
      },
      output: {
        // Three.js va en su propio chunk: solo lo descarga quien abre una escena 3D.
        manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : undefined),
      },
    },
  },
});
