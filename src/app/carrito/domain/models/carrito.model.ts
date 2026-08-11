export interface ItemCarrito {
  id_programa:     number;
  nombre_programa: string;
  slug:            string | null;
  foto:            string | null;
  plan_costo:      number | null;
  plan_nro_cuotas: number | null;
  id_plan:         number | null;
  inversion:       string | null;
}
