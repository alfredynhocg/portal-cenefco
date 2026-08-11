export interface EfectoEspecial {
  id:               number;
  nombre:           string;
  tipo_efecto:      'nieve' | 'confetti' | 'hojas' | 'estrellas';
  color_primario:   string | null;
  color_secundario: string | null;
  fecha_inicio:     string;
  fecha_fin:        string;
  intensidad:       number;
  activo:           boolean;
}

export interface EfectosActivosResponse {
  data: EfectoEspecial[];
}
