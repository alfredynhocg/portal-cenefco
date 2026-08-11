export interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  entradilla: string | null;
  cuerpo: string | null;
  imagen_principal_url: string | null;
  estado: string;
  destacada: boolean;
  vistas: number;
  fecha_publicacion: string | null;
  categoria?: { id: number; nombre: string } | null;
}

export interface NoticiaListResponse {
  data: Noticia[];
  total: number;
}
