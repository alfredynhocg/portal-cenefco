export interface GaleriaVideo {
  id:            number;
  titulo:        string;
  descripcion:   string | null;
  plataforma:    string | null;
  url_video:     string;
  video_id:      string | null;
  miniatura_url: string | null;
  duracion:      string | null;
  tipo:          string | null;
  programa_id:   number | null;
  destacado:     boolean | number;
  orden:         number;
  vistas:        number;
  activo:        boolean | number;
  created_at:    string | null;
}

export interface GaleriaVideoListResponse {
  data:  GaleriaVideo[];
  total: number;
}
