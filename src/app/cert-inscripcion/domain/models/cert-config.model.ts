export interface CertConfigItem {
  id: number;
  config_id: number;
  plantilla_id: number | null;
  nombre_cert: string;
  precio: number;
  es_gratuito: boolean;
  orden: number;
  activo: boolean;
}

export interface CertConfigPortal {
  activo: boolean;
  config?: {
    id: number;
    programa_id: number;
    titulo: string | null;
    descripcion: string | null;
    items: CertConfigItem[];
  };
}

export interface CrearSolicitudesPayload {
  programa_id: number;
  usuario_ci: string;
  usuario_nombre: string;
  usuario_email?: string | null;
  inscripcion_id?: number | null;
  items_pago_ids: number[];
  pagar_ahora: boolean;
  comprobante_url?: string | null;
}

export interface CertSolicitud {
  id: number;
  config_item_id: number;
  es_gratuito: boolean;
  estado: 'generado' | 'pendiente_pago' | 'pendiente_revision' | 'rechazado' | 'no_participa';
  certificado_id: number | null;
  certificado_url: string | null;
}
