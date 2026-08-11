import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormularioTramite, FormularioTramiteListResponse } from '../../domain/models/formulario-tramite.model';

@Injectable({ providedIn: 'root' })
export class FormularioTramiteService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/galeria-videos';

  getPaginado(
    pageIndex: number,
    pageSize: number,
    query?: string,
    tramiteNombre?: string
  ): Observable<FormularioTramiteListResponse> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('publicado', true)
      .set('vigente', true);
    if (query) params = params.set('query', query);
    return this.http.get<FormularioTramiteListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<FormularioTramite> {
    return this.http.get<FormularioTramite>(`${this.baseUrl}/${id}`);
  }
}
