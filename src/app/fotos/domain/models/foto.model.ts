export interface Foto {
  id_foto: number;
  num_foto: number;
  titulo_foto: string;
  descripcion_foto: string | null;
  foto: string | null;
  fecha_foto: string | null;
  estado: number;
}

export interface FotoListResponse {
  data: Foto[];
  total: number;
}
