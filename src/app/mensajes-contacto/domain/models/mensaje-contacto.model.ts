export interface CreateMensajeContacto {
  nombre_remitente: string;
  email_remitente: string;
  asunto: string;
  mensaje: string;
  telefono_remitente?: string | null;
  secretaria_destino_id?: number | null;
  captcha_key: string;
  captcha_value: string;
}

export interface MensajeContacto {
  id: number;
  nombre_remitente: string;
  email_remitente: string;
  telefono_remitente: string | null;
  asunto: string;
  mensaje: string;
  estado: string;
  created_at: string | null;
}
