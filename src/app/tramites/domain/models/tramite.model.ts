export interface Tramite {
  id: number;
  tipo_tramite_id: number;
  tipo_nombre: string | null;
  nombre: string;
  slug: string;
  descripcion: string | null;
  procedimiento: string | null;
  costo: number | null;
  moneda: string;
  dias_habiles_resolucion: number | null;
  normativa_base: string | null;
  url_formulario: string | null;
  modalidad: string;
  activo: boolean;
}

export interface TramiteListResponse {
  data: Tramite[];
  total: number;
}
