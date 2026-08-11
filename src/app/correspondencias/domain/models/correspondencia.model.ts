export interface Correspondencia {
  cite: string;
  asunto: string;
  remitente: string;
  remitente_ci: string | null;
  tipo_documento: string;
  tipo_correspondencia: string;
  urgencia: string;
  descripcion: string | null;
  plazo_legal: number;
  canal_ingreso: string;
  registrado_por: string;
  nodo_actual: string;
  fecha_vencimiento: string | null;
  estado: string;
  fecha_registro: string;
}
