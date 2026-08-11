export interface TipoTramite {
  id: number;
  nombre: string;
  slug: string;
  icono_url: string | null;
  color_hex: string | null;
  activo: boolean;
  orden: number;
}

export interface TipoTramiteListResponse {
  data: TipoTramite[];
  total: number;
}
