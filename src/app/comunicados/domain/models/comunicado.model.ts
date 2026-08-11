export interface Comunicado {
  id: number;
  titulo: string;
  slug: string;
  resumen: string | null;
  cuerpo: string | null;
  imagen_url: string | null;
  archivo_url: string | null;
  estado: string;
  destacado: boolean;
  vistas: number;
  fecha_publicacion: string | null;
}

export interface ComunicadoListResponse {
  data: Comunicado[];
  total: number;
}
