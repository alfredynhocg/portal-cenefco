export interface IniciarPagoPayload {
  id_programa:   number;
  nombre:        string;
  appaterno:     string;
  ci:            string;
  expedido?:     string | null;
  email:         string;
  telefono?:     string | null;
  id_fechapago?: number | null;
  monto:         number;
  success_url:   string;
  cancel_url:    string;
}

export interface IniciarPagoMultiplePayload {
  items: Array<{ id_programa: number; monto: number }>;
  nombre:      string;
  appaterno:   string;
  ci:          string;
  expedido?:   string | null;
  email:       string;
  telefono?:   string | null;
  success_url: string;
  cancel_url:  string;
}

export interface IniciarPagoResponse {
  session_id:   number;
  checkout_url: string;
}

export interface PagoEstadoResponse {
  session_id: number;
  estado:     'pendiente' | 'pagado' | 'fallido' | 'expirado';
  expires_at: string | null;
}

export interface BuscarCiResponse {
  nombre:    string | null;
  appaterno: string | null;
  apmaterno: string | null;
  ci:        string | null;
  email:     string | null;
  celular:   string | null;
  expedido:  string | null;
}

export interface CuotaEstado {
  id_fechapago:  number;
  nro_pago:      string | null;
  monto_a_pagar: number;
  pagado:        boolean;
  monto_pagado:  number | null;
  fecha_pago:    string | null;
  metodo_pago:   'efectivo' | 'deposito_bancario' | 'pago_online' | 'qr' | null;
}

export interface InscripcionResumen {
  id_ins:          number;
  nombre_programa: string | null;
  programa_slug:   string | null;
  periodo:         string | null;
  gestion:         number | null;
  fecha_ins:       string | null;
  fecha_inicio:    string | null;
  fecha_fin:       string | null;
  canal_venta:     string | null;
  total_plan:      number;
  total_pagado:    number;
  saldo:           number;
  estado_pago:     'pagado' | 'parcial' | 'pendiente';
  cuotas:          CuotaEstado[];
  nro_pagos:       number;
}

export interface EstudianteResumen {
  id_us:    number;
  nombre:   string;
  ci:       string;
  expedido: string | null;
  email:    string | null;
  celular:  string | null;
}

export interface MisPagosResponse {
  estudiante: EstudianteResumen | null;
  data:       InscripcionResumen[];
}
