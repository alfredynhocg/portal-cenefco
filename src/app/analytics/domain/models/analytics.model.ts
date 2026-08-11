export interface VisitaPayload {
  session_id:    string;
  url:           string;
  ruta:          string;
  titulo?:       string;
  referrer?:     string;
  pais?:         string;
  ciudad?:       string;
  dispositivo?:  string;
  navegador?:    string;
  so?:           string;
  duracion_seg?: number;
}
