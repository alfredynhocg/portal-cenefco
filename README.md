# CENEFCO Portal

Portal web público del Centro de Formación Continua — CENEFCO.
Construido con **Angular 20 standalone + zoneless**, consume la API en `cenefco-api` (Laravel 12).

- Portal: `http://localhost:4201`
- Admin: `http://localhost:4200`
- API: `http://localhost:8000`

```bash
npm start        # set-env + ng serve --port 4201
npm run build    # build de producción
npm run set-env  # regenera environment.ts desde cenefco-api/.env
```

---

## Páginas disponibles para el menú

Lista de todas las páginas navegables del portal. Las marcadas con ⭐ son las más relevantes para exponer en el menú principal.

### Institucional

| Etiqueta sugerida | URL | Descripción |
|---|---|---|
| Inicio | `/` | Landing page principal |
| CENEFCO | `/cenefco` | Página institucional del centro |
| Fortaleciendo tu Educación | `/fortalenciendo-tu-educacion` | Sección de propuesta educativa |
| Contacto | `/contactos` | Formulario de contacto y mapa |

### Oferta académica

| Etiqueta sugerida | URL | Descripción |
|---|---|---|
| ⭐ Áreas de Conocimiento | `/areas` | Listado de áreas académicas |
| ⭐ Cursos y Programas | `/cursos` | Listado de cursos activos con inscripción |
| ⭐ Cursos Pasados | `/cursos-pasados` | Historial de cursos con listado de participantes |
| Convenios | `/convenios` | Convenios institucionales |
| Biblioteca | `/biblioteca` | Publicaciones y material bibliográfico |
| Videos | `/videos` | Galería de videos institucionales |

### Noticias y comunicados

| Etiqueta sugerida | URL | Descripción |
|---|---|---|
| ⭐ Noticias | `/noticias` | Listado de noticias |
| Comunicados | `/comunicados` | Listado de comunicados oficiales |
| Eventos | `/eventos` | Agenda de eventos |

### Servicios al estudiante

| Etiqueta sugerida | URL | Descripción |
|---|---|---|
| Verificar Certificado | `/verificar-certificado` | Consulta de certificados por código QR |
| Reseñas | `/resenas` | Testimonios de estudiantes |
| Preguntas Frecuentes | `/preguntas-frecuentes` | FAQ del centro |

### Páginas internas (no para el menú)

Estas páginas existen pero son de flujo interno o detalle — no deben aparecer directamente en el menú:

| URL | Descripción |
|---|---|
| `/cursos/:slug` | Detalle de un curso activo |
| `/cursos-pasados/:slug` | Detalle de un curso pasado + participantes |
| `/areas/:slug` | Detalle de un área de conocimiento |
| `/noticias/:slug` | Detalle de una noticia |
| `/comunicados/:slug` | Detalle de un comunicado |
| `/eventos/:id` | Detalle de un evento |
| `/biblioteca/:tipo/:slug` | Detalle de publicación |
| `/mis-pagos` | Pagos del estudiante (requiere sesión) |
| `/mis-pagos/:id_ins` | Detalle de inscripción |
| `/carrito` | Carrito de compras |
| `/verificar-certificado` | Verificación por código |
| `/chatbot` | Chatbot CENEFCO |
