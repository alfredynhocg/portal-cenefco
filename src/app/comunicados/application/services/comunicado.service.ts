import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comunicado, ComunicadoListResponse } from '../../domain/models/comunicado.model';

@Injectable({ providedIn: 'root' })
export class ComunicadoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/comunicados';

  getRecientes(pageSize = 3): Observable<ComunicadoListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_publicacion')
      .set('sort[order]', 'desc');
    return this.http.get<ComunicadoListResponse>(this.baseUrl, { params });
  }

  getPaginado(pageIndex: number, pageSize: number): Observable<ComunicadoListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_publicacion')
      .set('sort[order]', 'desc');
    return this.http.get<ComunicadoListResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<Comunicado> {
    return this.http.get<Comunicado>(`${this.baseUrl}/slug/${slug}`);
  }
}
