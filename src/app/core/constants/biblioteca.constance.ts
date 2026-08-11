export const BIBLIOTECA_CONSTANCE = {
  breadcrumb: {
    title: 'Repositorio Bibliográfico',
    pages: [
      { title: 'Inicio', url: '/' },
      { title: 'Biblioteca', url: '/biblioteca' },
    ],
  },
  hero: {
    badge: 'Repositorio Digital',
    title: 'Biblioteca',
    titleHighlight: 'CENEFCO',
    subtitle: 'Accede a tesis, monografías, revistas y publicaciones científicas de nuestra institución.',
  },
  search: {
    placeholder: 'Buscar por título, autor, palabras clave…',
    noResults: 'No se encontraron publicaciones con los filtros seleccionados.',
    noResultsHint: 'Intenta con otros términos o limpia los filtros.',
  },
  tipos: [
    { key: 'todos', label: 'Todos', icon: 'fa-solid fa-layer-group' },
    { key: 'tesis', label: 'Tesis', icon: 'fa-solid fa-graduation-cap' },
    { key: 'monografia', label: 'Monografías', icon: 'fa-solid fa-book-open' },
    { key: 'revista', label: 'Revistas', icon: 'fa-solid fa-newspaper' },
    { key: 'revista-cientifica', label: 'Revistas Científicas', icon: 'fa-solid fa-flask' },
  ],
} as const;
