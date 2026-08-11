export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string | null;
  secretaria: string | null;
  categoria: string | null;
  ubicacion: string | null;
  presupuesto: number | null;
  estado: 'planificacion' | 'en_ejecucion' | 'paralizado' | 'concluido' | 'cancelado' | null;
  porcentaje_avance: number | null;
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
  fecha_fin_real: string | null;
  imagen_url: string | null;
  publicado: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProyectoListResponse {
  data: Proyecto[];
  total: number;
}
