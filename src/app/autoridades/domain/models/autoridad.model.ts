export interface Autoridad {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  tipo: string;
  perfil_profesional: string | null;
  email_institucional: string | null;
  foto_url: string | null;
  orden: number;
  activo: boolean;
  publicado_web: boolean;
  fecha_inicio_cargo: string | null;
  slug: string | null;
}

export interface AutoridadListResponse {
  data: Autoridad[];
  total: number;
}
