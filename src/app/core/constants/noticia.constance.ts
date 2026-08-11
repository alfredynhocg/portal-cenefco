export const NOTICIAS = {
  breadcrumb: {
    title: 'Noticias',
    subTitleFallback: 'Noticia',
  },
  detalles: {
    loading: 'Cargando...',
    notFound: 'Noticia no encontrada.',
    destacada: 'Destacada',
    shareTitle: 'Compartir:',
    btnBack: 'Volver a Noticias',
  },
  lista: {
    loading: 'Cargando noticias...',
    btnLeerMas: 'Leer más',
    noData: 'No hay noticias disponibles en este momento.',
    pagination: {
      prefix: 'Página',
      separator: 'de',
      suffix: 'noticias en total',
    },
  },
  imagenes: {
    fallback: 'assets/img/all-images/blog-img1.png',
    header: 'assets/img/bg/header-img1.jpg',
  },
} as const;
