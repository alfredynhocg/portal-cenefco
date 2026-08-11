export const EVENTOS = {
  breadcrumb: {
    title: 'Eventos',
    subTitleFallback: 'Evento',
  },
  detalles: {
    loading: 'Cargando...',
    notFound: 'Evento no encontrado.',
    btnBack: 'Volver a Eventos',
    transmisionTitle: 'Transmisión en vivo',
    btnVerTransmision: 'Ver transmisión',
    galeriaTitle: 'Galería de fotos',
    labels: {
      todoElDia: 'Todo el día',
      inicio: 'Inicio:',
      fin: 'Fin:',
    },
  },
  lista: {
    loading: 'Cargando eventos...',
    btnVerDetalle: 'Ver detalle',
    noData: 'No hay eventos registrados en este momento.',
    pagination: {
      prefix: 'Página',
      separator: 'de',
      suffix: 'eventos en total',
    },
  },
  estados: {
    programado: 'Programado',
    en_curso: 'En Curso',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado',
  },
  imagenes: {
    header: 'assets/img/bg/header-img1.jpg',
  },
} as const;
