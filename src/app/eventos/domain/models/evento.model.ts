export interface Evento {
  id: number;
  titulo: string;
  slug: string | null;
  tipo: string | null;
  modalidad: string | null;
  descripcion: string | null;
  imagen_url: string | null;
  lugar: string | null;
  latitud: number | null;
  longitud: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  todo_el_dia: boolean;
  estado: string;
  url_transmision: string | null;
  publico: boolean;
  tipo_nombre: string | null;
  created_at: string | null;
}

export interface EventoFoto {
  id: number;
  evento_id: number;
  archivo_url: string;
  titulo: string | null;
  orden: number;
}

export interface EventoListResponse {
  data: Evento[];
  total: number;
}
