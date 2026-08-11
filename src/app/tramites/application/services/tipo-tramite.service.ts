import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTramiteListResponse } from '../../domain/models/tipo-tramite.model';

@Injectable({ providedIn: 'root' })
export class TipoTramiteService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/tipos-tramite';

  getAll(): Observable<TipoTramiteListResponse> {
    const params = new HttpParams()
      .set('pageSize', 50)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<TipoTramiteListResponse>(this.baseUrl, { params });
  }
}
