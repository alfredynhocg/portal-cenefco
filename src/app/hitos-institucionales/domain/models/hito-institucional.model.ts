export interface HitoInstitucional {
  id:          number;
  anio:        string;
  titulo:      string;
  descripcion: string | null;
  imagen_url:  string | null;
  imagen_alt:  string | null;
  orden:       number;
  activo:      boolean;
}

export interface HitoInstitucionalListResponse {
  data:  HitoInstitucional[];
  total: number;
}
