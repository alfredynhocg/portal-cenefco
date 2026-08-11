import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditoriaListResponse, Auditoria } from '../../domain/models/auditoria.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/documentos-transparencia';

  getAll(perPage = 50): Observable<AuditoriaListResponse> {
    const params = new HttpParams()
      .set('per_page', perPage)
      .set('sort', 'gestion_auditada')
      .set('order', 'desc')
      .set('publico', 'true');
    return this.http.get<AuditoriaListResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<Auditoria> {
    return this.http.get<Auditoria>(`${this.baseUrl}/slug/${slug}`);
  }
}
