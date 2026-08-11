export const CALENDARIO_ACADEMICO = {
  breadcrumb: {
    title: 'Calendario Académico',
  },
  lista: {
    loading: 'Cargando calendario...',
    diaVacio: 'No hay eventos programados este día.',
  },
  imagenes: {
    header: 'assets/img/bg/header-img1.jpg',
  },
} as const;

export interface TipoEventoOpt {
  value: string;
  label: string;
  color: string;
}

export const TIPOS_EVENTO: TipoEventoOpt[] = [
  { value: 'inscripciones', label: 'Inscripciones',          color: '#3b82f6' },
  { value: 'inicio_clases', label: 'Inicio de Clases',       color: '#10b981' },
  { value: 'finalizacion',  label: 'Finalización / Cierre',  color: '#f59e0b' },
  { value: 'evaluacion',    label: 'Evaluación / Examen',    color: '#8b5cf6' },
  { value: 'graduacion',    label: 'Graduación / Ceremonia', color: '#ec4899' },
  { value: 'feriado',       label: 'Feriado',                color: '#ef4444' },
  { value: 'otro',          label: 'Otro',                   color: '#6b7280' },
];
