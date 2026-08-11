export interface ConfiguracionSitio {
  id?:                  number;
  nombre?:              string;
  slogan?:              string;
  descripcion?:         string | null;
  logo_url?:            string | null;
  favicon_url?:         string | null;
  email_contacto?:      string | null;
  telefono?:            string | null;
  direccion?:           string | null;
  ciudad?:              string | null;
  pais?:                string | null;
  latitud?:             number | null;
  longitud?:            number | null;
  horario_atencion?:    string | null;
  whatsapp_numero?:     string | null;
  whatsapp_mensaje?:    string | null;
  meta_titulo?:         string | null;
  meta_descripcion?:    string | null;
  meta_keywords?:       string | null;
  google_analytics_id?: string | null;
  activo?:              number;
  himno?:               string | null;
  nombre_municipio?:    string | null;
}

export interface ConfiguracionResponse {
  data: ConfiguracionSitio;
}

export interface ConfiguracionPublica {
  nombre_sitio?:          string;
  nombre_institucion?:    string;
  slogan?:                string;
  descripcion_corta?:     string;
  quienes_somos?:         string;
  mision?:                string;
  vision?:                string;
  valores?:               string;
  imagen_institucional_url?: string;
  hero_banner_url?:          string;
  email_contacto?:        string;
  telefono_principal?:    string;
  whatsapp_numero?:       string;
  direccion?:             string;
  ciudad?:                string;
  horario_atencion?:      string;
  [key: string]: string | undefined;
}

export interface ConfiguracionPublicaResponse {
  data: ConfiguracionPublica;
}
