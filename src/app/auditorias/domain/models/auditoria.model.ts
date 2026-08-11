export interface Auditoria {
  id: number;
  codigo_auditoria: string;
  titulo: string;
  objeto_examen: string | null;
  entidad_auditora: string | null;
  gestion_auditada: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: string;
  informe_pdf_url: string | null;
  imagen_url: string | null;
  publico: boolean;
  tipo_nombre: string;
  secretaria_nombre: string | null;
  slug: string;
}

export interface AuditoriaListResponse {
  data: Auditoria[];
  total: number;
}
