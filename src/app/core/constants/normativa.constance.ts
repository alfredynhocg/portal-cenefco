export const NORMATIVA = {
  titulos: {
    decreto: 'Decretos Municipales',
    resolucion: 'Resoluciones Municipales',
    ordenanza: 'Ordenanzas Municipales',
    fallback: 'Toda la Normativa Municipal',
  },
  lista: {
    loading: 'Cargando normativa...',
    noData: 'No hay documentos normativos publicados en este momento.',
    btnVerPdf: 'Ver / Descargar PDF',
    sinPdf: 'PDF no disponible',
    pagination: {
      prefix: 'Página',
      separator: 'de',
      suffix: 'documentos en total',
    },
  },
  imagenes: {
    header: 'assets/img/bg/header-img1.jpg',
  },
} as const;
