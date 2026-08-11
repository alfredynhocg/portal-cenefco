export interface CifraInstitucional {
  id:          number;
  valor:       string;
  etiqueta:    string;
  descripcion: string | null;
  icono:       string | null;
  color:       string | null;
  orden:       number;
  activo:      boolean;
}
