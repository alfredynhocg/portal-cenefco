import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resena {
  id: number;
  programa_id: number | null;
  nombre: string;
  cargo_actual: string | null;
  foto_url: string | null;
  calificacion: number;
  titulo_resena: string | null;
  resena: string;
  estado: string;
  verificado: boolean;
  destacada: boolean;
  nombre_programa: string | null;
  created_at: string;
}

export interface CreateResenaPayload {
  programa_id: number;
  nombre: string;
  cargo_actual?: string;
  calificacion: number;
  titulo_resena?: string;
  resena: string;
}

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private http = inject(HttpClient);

  getAll(pageIndex = 1, pageSize = 12): Observable<{ data: Resena[]; total: number }> {
    const params = new HttpParams()
      .set('estado', 'aprobado')
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    return this.http.get<{ data: Resena[]; total: number }>('/api/v1/public/resenas', { params });
  }

  getByPrograma(programaId: number): Observable<{ data: Resena[]; total: number }> {
    const params = new HttpParams()
      .set('programa_id', programaId)
      .set('estado', 'aprobado')
      .set('pageSize', '50');
    return this.http.get<{ data: Resena[]; total: number }>('/api/v1/public/resenas', { params });
  }

  create(payload: CreateResenaPayload): Observable<Resena> {
    return this.http.post<Resena>('/api/v1/public/resenas', payload);
  }
}
