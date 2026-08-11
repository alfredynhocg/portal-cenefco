import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AudienciaPublica, AudienciaPublicaListResponse } from '../../domain/models/audiencia-publica.model';

@Injectable({ providedIn: 'root' })
export class AudienciaPublicaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/acreditaciones';

  getPaginado(pageIndex: number, pageSize: number): Observable<AudienciaPublicaListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'created_at')
      .set('sort[order]', 'desc');
    return this.http.get<AudienciaPublicaListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<AudienciaPublica> {
    return this.http.get<AudienciaPublica>(`${this.baseUrl}/${id}`);
  }
}
