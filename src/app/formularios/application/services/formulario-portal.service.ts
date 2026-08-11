import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormularioPortal } from '../../domain/models/formulario-portal.model';

export interface CiBusquedaResult {
  nombre:           string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  ci:               string;
  email:            string | null;
  telefono:         string | null;
  ya_inscrito:      boolean;
}

@Injectable({ providedIn: 'root' })
export class FormularioPortalService {
  private http = inject(HttpClient);

  getBySlug(slug: string): Observable<FormularioPortal> {
    return this.http.get<FormularioPortal>(`/api/v1/public/formularios/${slug}/publico`);
  }

  getById(id: number): Observable<FormularioPortal> {
    return this.http.get<FormularioPortal>(`/api/v1/public/formularios/id/${id}/publico`);
  }

  submitInscripcion(payload: Record<string, unknown>): Observable<{ message: string; inscripcion_id?: number | null }> {
    return this.http.post<{ message: string; inscripcion_id?: number | null }>('/api/v1/public/inscripciones', payload);
  }

  uploadFile(file: File): Observable<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>('/api/v1/public/upload/file', fd);
  }

  buscarPorCi(ci: string, programaId?: number | null): Observable<CiBusquedaResult | null> {
    const params: Record<string, string> = { ci };
    if (programaId) params['programa_id'] = String(programaId);
    return this.http.get<CiBusquedaResult | null>(`/api/v1/public/usuarios/buscar-ci`, { params });
  }
}
