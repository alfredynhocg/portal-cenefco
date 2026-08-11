export interface Certificado {
    id:                     number;
    codigo_verificacion:    string;
    nombre_en_certificado:  string;
    programa_en_certificado: string;
    condicion:              string;
    nota_final:             number | null;
    horas_academicas:       number | null;
    fecha_inicio_curso:     string | null;
    fecha_fin_curso:        string | null;
    estado:                 string;
    qr_url:                 string | null;
    archivo_url:            string | null;
    archivo_miniatura_url:  string | null;
    created_at:             string | null;
}
