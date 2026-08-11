export interface ParticipantePasado {
  id:              number;
  nombre_completo: string;
}

export interface LogoPasado {
  id:     number;
  path:   string;
  nombre: string | null;
}

export interface CursoPasado {
  id:                  number;
  nombre:              string;
  slug:                string;
  url:                 string;
  imagen_path:         string | null;
  qr_path?:            string | null;
  periodo:             string | null;
  gestion:             string | null;
  fecha_inicio:        string | null;
  carga_horaria:       number | null;
  participantes_count: number;
  participantes?:      ParticipantePasado[];
  logos?:              LogoPasado[];
}

export interface CursoPasadoListResponse {
  data:  CursoPasado[];
  total: number;
}
