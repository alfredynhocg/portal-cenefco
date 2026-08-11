export interface AudienciaPublica {
  id: number;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  estado: string;
  acta_url: string | null;
  afiche_url: string | null;
  imagenes: string[];
  video_url: string | null;
  enlace_virtual: string | null;
  asistentes: number | null;
  slug: string | null;
  created_at: string | null;
}

export interface AudienciaPublicaListResponse {
  data: AudienciaPublica[];
  total: number;
}
