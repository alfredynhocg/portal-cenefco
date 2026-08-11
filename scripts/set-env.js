/**
 * set-env.js — Sincroniza variables del backend .env al environment de Angular.
 *
 * Desarrollo:  lee ../cenefco-api/.env  → escribe environment.ts
 * Producción:  lee process.env (CI/CD)  → escribe environment.production.ts
 *
 * Uso:
 *   node scripts/set-env.js           (dev)
 *   node scripts/set-env.js --prod    (producción / CI)
 */

const fs   = require('fs');
const path = require('path');

const isProd   = process.argv.includes('--prod');
const rootDir  = path.resolve(__dirname, '..');
const backendEnvPath = path.resolve(rootDir, '../cenefco-api/.env');

// ── Parsear .env sin dependencias externas ────────────────────────────────────
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .reduce((acc, line) => {
      const match = line.match(/^\s*([^#\s=][^=]*?)\s*=\s*(.*?)\s*$/);
      if (match) acc[match[1]] = match[2].replace(/^["']|["']$/g, '');
      return acc;
    }, {});
}

// ── Resolver variables ────────────────────────────────────────────────────────
let vars;
let source;

if (isProd) {
  // CI/CD: leer de variables de entorno del sistema
  vars   = process.env;
  source = 'variables de entorno del sistema (CI/CD)';
} else {
  // Desarrollo: leer del backend .env
  vars   = parseEnvFile(backendEnvPath);
  source = backendEnvPath;
  if (Object.keys(vars).length === 0) {
    console.warn(`⚠  No se encontró ${backendEnvPath}. Usando variables del sistema.`);
    vars   = process.env;
    source = 'variables de entorno del sistema';
  }
}

const apiEncryptKey = vars['API_ENCRYPT_KEY'] || '';
const portalApiKey  = vars['PORTAL_API_KEY']  || '';
const apiBaseUrl    = vars['APP_URL'] || 'http://localhost:8000';
const googleClientId = vars['GOOGLE_CLIENT_ID'] || '';

if (!apiEncryptKey) console.warn('⚠  API_ENCRYPT_KEY no encontrada — el descifrado no funcionará.');
if (!portalApiKey)  console.warn('⚠  PORTAL_API_KEY no encontrada — las peticiones al portal serán rechazadas.');
if (!googleClientId) console.warn('⚠  GOOGLE_CLIENT_ID no encontrada — "Iniciar sesión con Google" no funcionará.');

// ── Generar archivo ───────────────────────────────────────────────────────────
const targetFile = isProd
  ? 'src/environments/environment.production.ts'
  : 'src/environments/environment.ts';

const content = `// Generado automáticamente por scripts/set-env.js — NO editar manualmente.
// Para regenerar: npm run set-env${isProd ? ':prod' : ''}
export const environment = {
  production: ${isProd},
  apiBaseUrl: '${apiBaseUrl}',
  portalApiKey: '${portalApiKey}',
  apiEncryptKey: '${apiEncryptKey}',
  googleClientId: '${googleClientId}',
};
`;

fs.writeFileSync(path.join(rootDir, targetFile), content, 'utf8');
console.log(`✓ ${targetFile} sincronizado desde ${source}`);
