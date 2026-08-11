export type TipoCampoPortal =
  | 'text' | 'email' | 'tel' | 'number' | 'date'
  | 'textarea' | 'select' | 'file' | 'checkbox';

export interface ValidacionCampoPortal {
  min?:           number | null;
  max?:           number | null;
  min_length?:    number | null;
  max_length?:    number | null;
  patron?:        string | null;
  extensiones?:   string[] | null;
  tamano_max_mb?: number | null;
}

export interface CampoFormularioPortal {
  nombre_campo: string;
  etiqueta:     string;
  tipo:         TipoCampoPortal;
  requerido:    boolean;
  placeholder?: string;
  ayuda?:       string;
  opciones?:    string[];
  validacion?:  ValidacionCampoPortal | null;
}

export interface FormularioPortal {
  id:          number;
  nombre:      string;
  slug:        string;
  descripcion: string | null;
  campos:      CampoFormularioPortal[];
}
