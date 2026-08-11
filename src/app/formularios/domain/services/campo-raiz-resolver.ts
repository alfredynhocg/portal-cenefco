
export const CLAVES_RAIZ = ['ci', 'nombre', 'apellido_paterno', 'apellido_materno', 'email', 'telefono'] as const;
export type ClaveRaiz = typeof CLAVES_RAIZ[number];

const ALIAS: Record<string, ClaveRaiz> = {
  ci: 'ci',
  cedula: 'ci',
  cedula_identidad: 'ci',
  carnet: 'ci',
  carnet_identidad: 'ci',
  nro_ci: 'ci',
  numero_ci: 'ci',
  documento_identidad: 'ci',

  nombre: 'nombre',
  nombres: 'nombre',
  nombre_completo: 'nombre',
  primer_nombre: 'nombre',

  apellido_paterno: 'apellido_paterno',
  paterno: 'apellido_paterno',
  apellidopaterno: 'apellido_paterno',
  apellido1: 'apellido_paterno',

  apellido_materno: 'apellido_materno',
  materno: 'apellido_materno',
  apellidomaterno: 'apellido_materno',
  apellido2: 'apellido_materno',

  email: 'email',
  correo: 'email',
  correo_electronico: 'email',
  mail: 'email',
  e_mail: 'email',

  telefono: 'telefono',
  celular: 'telefono',
  nro_celular: 'telefono',
  numero_celular: 'telefono',
  whatsapp: 'telefono',
  nro_telefono: 'telefono',
  numero_telefono: 'telefono',
};

export function normalizarNombreCampo(valor: string): string {
  let v = valor.trim().toLowerCase();
  v = v.replace(/[áéíóúñü]/g, (c) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n', ü: 'u' }[c] ?? c));
  v = v.replace(/[^a-z0-9]+/g, '_');
  return v.replace(/^_+|_+$/g, '');
}

export function resolverClaveRaiz(nombreCampo: string, rolIdentidad?: string | null): ClaveRaiz | null {
  if (rolIdentidad && (CLAVES_RAIZ as readonly string[]).includes(rolIdentidad)) {
    return rolIdentidad as ClaveRaiz;
  }
  const normalizado = normalizarNombreCampo(nombreCampo);
  return ALIAS[normalizado] ?? null;
}
