import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TramiteListResponse } from '../../domain/models/tramite.model';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/tramites';

  getAll(pageSize = 12): Observable<TramiteListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'nombre')
      .set('sort[order]', 'asc');
    return this.http.get<TramiteListResponse>(this.baseUrl, { params });
  }

  getByTipo(tipoTramiteId: number, pageSize = 20): Observable<TramiteListResponse> {
    const params = new HttpParams()
      .set('tipo_tramite_id', tipoTramiteId)
      .set('pageSize', pageSize)
      .set('sort[key]', 'nombre')
      .set('sort[order]', 'asc');
    return this.http.get<TramiteListResponse>(this.baseUrl, { params });
  }
}
