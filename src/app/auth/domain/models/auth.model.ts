export interface RegisterPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  tipo: string;
  activo: boolean;
  emailVerificado: boolean;
  rolId: number | null;
  rolNombre: string | null;
  permisos: string[] | null;
  createdAt: string;
  avatarUrl: string | null;
  ci: string | null;
  telefono: string | null;
}

export interface UpdatePerfilPayload {
  nombre?: string;
  apellido?: string;
  ci?: string;
  telefono?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  expires_at: string | null;
}
