import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  // Archivos que instala AI-DLC (Estaciones 4 y 5) para cada herramienta: no son código del producto.
  {
    ignores: ['aidlc/**', '.aidlc/**', '.claude/**', '.codex/**', '.cursor/**', '.opencode/**', '.kiro/**', '.github/hooks/**'],
  },
];

export default config;
