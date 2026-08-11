export interface InformeAuditoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  pdf_url: string | null;
  pdf_nombre: string | null;
  estado: string;
  fecha: string | null;
  anio: number;
  publicado_en_web: boolean;
  created_at: string | null;
}

export interface InformeAuditoriaListResponse {
  data: InformeAuditoria[];
  total: number;
}
