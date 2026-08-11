export type TipoPublicacion = 'tesis' | 'monografia' | 'revista' | 'revista-cientifica';

export interface Publicacion {
  id: number;
  titulo: string;
  autor: string | null;
  resumen: string | null;
  tipo: TipoPublicacion;
  tipo_label: string | null;
  anio: number | null;
  area: string | null;
  portada_url: string | null;
  archivo_url: string | null;
  slug: string | null;
  palabras_clave: string | null;
  issn: string | null;
  volumen: string | null;
  numero: string | null;
  paginas: string | null;
  activo: boolean;
}

export interface PublicacionListResponse {
  data: Publicacion[];
  total: number;
}
