export const COMUNICADOS = {
  breadcrumb: {
    title: 'Comunicados',
    subTitleFallback: 'Comunicado',
  },
  detalles: {
    loading: 'Cargando...',
    notFound: 'Comunicado no encontrado.',
    destacado: 'Destacado',
    btnDownload: 'Descargar archivo adjunto',
    shareTitle: 'Compartir:',
    btnBack: 'Volver a Comunicados',
  },
  lista: {
    loading: 'Cargando comunicados...',
    btnLeerMas: 'Leer más',
    noData: 'No hay comunicados disponibles en este momento.',
    pagination: {
      prefix: 'Página',
      separator: 'de',
      suffix: 'comunicados en total',
    },
  },
  imagenes: {
    fallback: 'assets/img/all-images/blog-img1.png',
    header: 'assets/img/bg/header-img1.jpg',
  },
} as const;
