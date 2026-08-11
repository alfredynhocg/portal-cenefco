export interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  categoria: string | null;
  orden: number;
  activo: boolean;
}

export interface PreguntaFrecuenteListResponse {
  data: PreguntaFrecuente[];
  total: number;
}
