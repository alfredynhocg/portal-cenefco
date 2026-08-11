export interface CuotaPortal {
  id_fechapago:  number;
  nro_pago:      string | null;
  monto_a_pagar: number;
  tipo_tramite:  string | null;
  fecha_inicio:  string | null;
  fecha_fin:     string | null;
  obligatorio:   number;
}

export interface Curso {
  id_programa: number;
  nombre_programa: string;
  descripcion: string | null;
  foto: string | null;
  imagen_banner_url: string | null;
  tipo_nombre: string | null;
  categoria_nombre: string | null;
  slug: string | null;
  objetivo: string | null;
  dirigido: string | null;
  requisitos: string | null;
  inversion: string | null;
  creditaje: string | null;
  inicio_actividades: string | null;
  finalizacion_actividades: string | null;
  inicio_inscripciones: string | null;
  documento1: string | null;
  titulo_documento1: string | null;
  url_whatsapp: string | null;
  url_video: string | null;
  imagenes: string[] | null;
  id_plan:         number | null;
  plan_titulo:     string | null;
  plan_costo:      number | null;
  plan_nro_cuotas: number | null;
  plan_costo_por_cuota: number | null;
  cuotas:          CuotaPortal[];
  categoria_web_id: number | null;
  formulario_id:    number | null;
  categoria_campos: CategoriaCampo[];
  area_id:       number | null;
  area_titulo:   string | null;
  area_slug:     string | null;
  area_logo_url: string | null;
  area_color:    string | null;
  area_icono:    string | null;
}

export interface CategoriaCampo {
  id: number;
  nombre_campo: string;
  etiqueta: string;
  tipo_campo: string;
  requerido: boolean;
  activo: boolean;
  ayuda: string | null;
  opciones: string | string[] | null;
}

export interface CursoListResponse {
  data: Curso[];
  total: number;
}

export interface CursoParticipantes {
  curso: string;
  foto: string | null;
  imagen_banner_url: string | null;
  tipo_nombre: string | null;
  categoria_nombre: string | null;
  participantes: string[];
}
