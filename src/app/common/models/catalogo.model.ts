export interface CatalogoItemPublico {
  id: number;
  label: string;
}

export interface GradoAcademicoPublico {
  id: number;
  nombre: string;
  abreviatura: string;
  requiere_titulo: boolean;
}

export interface MedioPagoPublico {
  id:     number;
  nombre: string;
}

export interface ProfesionPublico {
  id:     number;
  nombre: string;
}
