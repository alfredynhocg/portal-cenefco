import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto, ProyectoListResponse } from '../../domain/models/proyecto.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/notas-prensa';

  getPaginado(
    pageIndex: number,
    pageSize: number,
    query?: string,
    estado?: string
  ): Observable<ProyectoListResponse> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('publicado', true);
    if (query)  params = params.set('query', query);
    if (estado) params = params.set('estado', estado);
    return this.http.get<ProyectoListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseUrl}/${id}`);
  }
}
