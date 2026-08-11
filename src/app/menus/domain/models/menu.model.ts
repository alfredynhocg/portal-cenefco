export interface MenuItem {
  id: number;
  menu_id: number;
  parent_id: number | null;
  etiqueta: string;
  url: string | null;
  orden: number;
  icono: string | null;
  activo: boolean;
  abrir_nueva_ventana: boolean;
  children?: MenuItem[];
}

export interface MenuItemsResponse {
  data: MenuItem[];
  total: number;
}
