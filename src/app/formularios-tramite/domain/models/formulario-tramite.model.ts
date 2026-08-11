export interface FormularioTramite {
  id: number;
  tramite_id: number | null;
  tramite_nombre: string | null;
  titulo: string;
  descripcion: string | null;
  version: string | null;
  archivo_url: string;
  archivo_nombre: string | null;
  orden: number;
  vigente: boolean;
  publicado: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface FormularioTramiteListResponse {
  data: FormularioTramite[];
  total: number;
}
