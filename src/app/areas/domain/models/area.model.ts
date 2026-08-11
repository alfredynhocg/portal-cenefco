export interface Area {
  id:               number;
  titulo:           string;
  slug:             string;
  descripcion:      string | null;
  logo_url:         string | null;
  logo_alt:         string | null;
  galeria:          string[];
  color:            string | null;
  icono:            string | null;
  orden:            number;
  activo:           boolean;
  meta_titulo:      string | null;
  meta_descripcion: string | null;
  total_cursos?:    number;
}

export interface AreaConCursos {
  area:   Area;
  cursos: AreaCurso[];
}

export interface AreaCurso {
  id_programa:      number;
  nombre_programa:  string;
  slug:             string | null;
  descripcion:      string | null;
  foto:             string | null;
  imagen_banner_url:string | null;
  inicio_actividades: string | null;
  creditaje:        string | null;
  inversion:        string | null;
  categoria_nombre: string | null;
}
