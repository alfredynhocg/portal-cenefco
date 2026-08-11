export interface Boletin {
  id_boletin:          number;
  num_boletin:         number;
  titulo_boletin:      string;
  titulo_pagina:       string | null;
  descripcion_boletin: string | null;
  estado:              number;
  imagen_url:          string | null;
  slug:                string | null;
  fecha_reg:           string | null;
}

export interface BoletinListResponse {
  data: Boletin[];
  total: number;
}
