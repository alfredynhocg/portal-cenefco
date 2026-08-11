export interface CalendarioAcademico {
  id: number;
  titulo: string;
  descripcion: string | null;
  tipo: string | null;
  color: string | null;
  programa_id: number | null;
  nombre_programa: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  todo_el_dia: boolean;
  destacado: boolean;
}

export interface CalendarioAcademicoListResponse {
  data: CalendarioAcademico[];
  total: number;
}
