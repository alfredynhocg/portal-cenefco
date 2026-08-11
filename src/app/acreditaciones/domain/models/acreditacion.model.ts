export interface Acreditacion {
  id:                 number;
  nombre:             string;
  entidad_otorgante:  string;
  tipo:               string | null;
  descripcion:        string | null;
  logo_url:           string | null;
  logo_alt:           string | null;
  fecha_obtencion:    string | null;
  fecha_vencimiento:  string | null;
  orden:              number;
  activo:             boolean;
}

export interface AcreditacionListResponse {
  data:  Acreditacion[];
  total: number;
}
