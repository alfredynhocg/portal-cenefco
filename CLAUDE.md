# CENEFCO Portal — Guía para Claude

## Contexto del proyecto

Portal web público del **CENEFCO (Centro de Formación Continua)**. Es una aplicación Angular 20 standalone que consume la API REST de `cenefco-api` (Laravel 12). Corre en puerto **4201** durante desarrollo. El admin corre en puerto **4200** (`cenefco-admin`).

El proyecto es una adaptación de un portal municipal anterior (Alcaldía de Achocalla). Los nombres de archivos, clases y módulos aún conservan referencias a `achocalla`/`alcaldia` como identificadores de código — esto es intencional para no romper imports. Solo el texto visible al usuario fue cambiado a CENEFCO.

---

## Ecosistema

```
cenefco/
├── cenefco-api/        ← Backend Laravel 12 (puerto 8000)
├── cenefco-admin/      ← Panel de administración Angular 20 (puerto 4200)
└── cenefco-portal/     ← Este proyecto (puerto 4201)
```

---

## Comandos esenciales

```bash
npm start               # set-env.js + ng serve --port 4201
npm run build           # set-env.js --prod + ng build
npm run set-env         # Regenera environment.ts desde ../cenefco-api/.env
npm run set-env:prod    # Regenera environment.production.ts desde variables de entorno del sistema
```

El script `scripts/set-env.js` lee `../cenefco-api/.env` y genera `src/environments/environment.ts` automáticamente. Si el archivo .env no existe, el build no falla pero las keys quedarán vacías (sin encriptación ni autenticación de portal).

---

## Arquitectura

### Angular 20 standalone — sin NgModules
- Todos los componentes usan `standalone: true`
- `app.config.ts` es el punto central de providers
- Change detection: **zoneless** — usar `cdr.detectChanges()` después de `subscribe()` si hay problemas de render

### Estructura de carpetas (DDD ligero)

```
src/app/
├── core/
│   ├── constants/          ← Textos estáticos de cada página (*.constance.ts)
│   ├── interceptors/       ← decrypt-response.interceptor.ts (AES-CBC)
│   └── directives/
├── layouts/
│   ├── layout/             ← LayoutComponent (shell: navbar + footer + CTA)
│   └── components/cta/
├── components/             ← Componentes reutilizables (footer, topbar, loader, etc.)
├── views/                  ← Páginas completas (lazy-loaded por ruta)
│   ├── achocalla/          ← Home (landing page)
│   ├── alcaldia/           ← Secciones internas (banner, comunicados, galería, etc.)
│   ├── institucional/      ← Alcalde/Director, himno, subalcaldías/aliados
│   ├── transparencia/      ← Rendición de cuentas, auditorías
│   ├── tramites/           ← Formularios de trámites
│   ├── comunicados/        ← Listado y detalle de comunicados
│   ├── noticias/           ← Listado y detalle de noticias
│   ├── proyectos/          ← Proyectos/notas de prensa
│   ├── normativa/          ← Normas/decretos
│   ├── audiencias-publicas/← Acreditaciones
│   ├── informes-auditoria/ ← Descargables
│   └── seguimiento/        ← Consulta de correspondencia/certificados
└── {feature}/              ← Módulo de dominio: domain/models/ + application/services/
```

### Módulos de dominio con remapeo de URLs

Cada feature tiene `domain/models/*.model.ts` + `application/services/*.service.ts`. Las URLs de servicio fueron remapeadas al contexto CENEFCO:

| Módulo | URL API |
|--------|---------|
| noticias | `/api/v1/portal/noticias` |
| comunicados | `/api/v1/portal/comunicados` |
| eventos | `/api/v1/portal/eventos` |
| banners | `/api/v1/portal/banners` |
| tramites | `/api/v1/portal/tramites` |
| formularios-tramite | `/api/v1/portal/galeria-videos` |
| decretos-municipales | `/api/v1/portal/normas` |
| proyectos | `/api/v1/portal/notas-prensa` |
| galerias | `/api/v1/portal/galeria-categorias` |
| auditorias | `/api/v1/portal/documentos-transparencia` |
| audiencias-publicas | `/api/v1/portal/acreditaciones` |
| informes-auditoria | `/api/v1/portal/descargables` |
| subalcaldias | `/api/v1/portal/aliados` |
| correspondencias | `/api/v1/portal/certificados` |
| captcha | `/api/v1/portal/popups` |
| menus | `/api/v1/portal/menus` |
| configuracion | `/api/v1/portal/configuracion` |
| autoridades | `/api/v1/portal/autoridades` |
| redes-sociales | `/api/v1/portal/redes-sociales` |
| preguntas-frecuentes | `/api/v1/portal/preguntas-frecuentes` |
| mensajes-contacto | `/api/v1/portal/mensajes-contacto` |

---

## Interceptor de encriptación

`src/app/core/interceptors/decrypt-response.interceptor.ts`

- Detecta header `X-Encrypted: 1` en la respuesta
- Descifra con **AES-CBC** usando `crypto.subtle.decrypt`
- Agrega automáticamente `X-Portal-Key` en todas las peticiones a rutas `/portal/`
- Requiere `environment.apiEncryptKey` (hex de 64 chars) y `environment.portalApiKey`
- Si las keys están vacías, las peticiones fallarán con 401 o respuestas ilegibles

---

## Entornos

`src/environments/environment.ts` (generado automáticamente — no editar a mano):

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000',
  apiEncryptKey: '',   // ← viene de API_ENCRYPT_KEY en cenefco-api/.env
  portalApiKey: '',    // ← viene de PORTAL_API_KEY en cenefco-api/.env
};
```

El archivo `src/environments/environment.example.ts` está en git como referencia. Los archivos `environment.ts` y `environment.production.ts` están en `.gitignore`.

---

## Proxy de desarrollo

`proxy.conf.json` — redirige al backend Laravel:

```json
{
  "/api":     { "target": "http://localhost:8000", "secure": false, "changeOrigin": true },
  "/storage": { "target": "http://localhost:8000", "secure": false, "changeOrigin": true }
}
```

---

## Rutas principales

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | AchocallaComponent | Landing page / home |
| `/comunicados` | ComunicadosListComponent | Listado de comunicados |
| `/comunicados/:slug` | ComunicadoDetailComponent | Detalle comunicado |
| `/noticias` | NoticiasListComponent | Listado de noticias |
| `/noticias/:slug` | NoticiaDetailComponent | Detalle noticia |
| `/institucional` | InstitucionalComponent | Página institucional |
| `/institucional/autoridades` | AutoridadesComponent | Director y equipo |
| `/institucional/aliados` | SubalcaldiasPageComponent | Aliados (ex-subalcaldías) |
| `/transparencia` | TransparenciaComponent | Transparencia |
| `/transparencia/rendicion-cuentas` | RendicionCuentasComponent | Informes |
| `/tramites` | TramitesComponent | Trámites disponibles |
| `/tramites/requisitos/:id` | FormularioDetalleComponent | Detalle formulario |
| `/normativa` | NormativaComponent | Normas y decretos |
| `/audiencias-publicas` | AudienciasPublicasComponent | Acreditaciones |
| `/proyectos` | ProyectosComponent | Notas de prensa |
| `/consultar-tramite` | SeguimientoComponent | Consulta certificados (captcha) |
| `/preguntas-frecuentes` | FaqComponent | Preguntas frecuentes |
| `/testimonios` | TestimonialsComponent | Testimonios |
| `/contactos` | ContactUsComponent | Formulario de contacto |
| `/terminos-condiciones` | TerminosCondicionesComponent | Términos legales |
| `/politica-privacidad` | PoliticaPrivacidadComponent | Política de privacidad |

---

## Dependencias notables

- **ngx-owl-carousel-o** — galería de fotos en la home
- **ngx-slick-carousel** (+ jquery + slick-carousel) — carrusel de proyectos
- **@ng-bootstrap/ng-bootstrap** — carrusel de comunicados, modales
- **aos** — animaciones al hacer scroll (inicializado en AppComponent.ngOnInit)
- **gsap** — animaciones avanzadas
- **ngx-countup** — contadores animados

jQuery es requerido como dependencia legacy de slick-carousel. Está incluido globalmente en `angular.json` como script.

---

## Patrones de código

### Servicios HTTP
```typescript
// Patrón estándar de paginación
getPaginado(pageIndex = 1, pageSize = 12): Observable<XListResponse> {
  const params = new HttpParams()
    .set('pageIndex', pageIndex)
    .set('pageSize', pageSize)
    .set('sort[key]', 'fecha')
    .set('sort[order]', 'desc');
  return this.http.get<XListResponse>(this.baseUrl, { params });
}
```

### Componentes con señales (Angular Signals)
```typescript
// Preferir signals para estado local en componentes nuevos
items = signal<Item[]>([]);
cargando = signal(true);
total = computed(() => this.items().length);
```

### Textos estáticos
Los textos de cada página van en `src/app/core/constants/*.constance.ts` (nótese la ortografía "constance", no "constants" — es el nombre de archivo del proyecto original). Los componentes los importan como `readonly CONSTANTS = NOMBRE_CONSTANTE`.

---

## Build y despliegue

- **Output:** `dist/current-ng/browser/`
- **Postbuild:** crea symlink `dist/current-ng/browser/storage` → `/var/www/cenefco-api/storage/app/public` (solo producción Linux)
- El nombre del proyecto en `angular.json` es `current-ng` (heredado del proyecto original)
