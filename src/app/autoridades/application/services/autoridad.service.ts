import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autoridad, AutoridadListResponse } from '../../domain/models/autoridad.model';

@Injectable({ providedIn: 'root' })
export class AutoridadService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/autoridades';

  getByTipo(tipo: string): Observable<Autoridad> {
    return this.http.get<Autoridad>(`${this.baseUrl}/tipo/${tipo}`);
  }

  getAll(pageSize = 50): Observable<AutoridadListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<AutoridadListResponse>(this.baseUrl, { params });
  }

  getPaginado(pageIndex = 1, pageSize = 12): Observable<AutoridadListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<AutoridadListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Autoridad> {
    return this.http.get<Autoridad>(`${this.baseUrl}/${id}`);
  }
}
