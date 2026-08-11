import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento, EventoFoto, EventoListResponse } from '../../domain/models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/eventos';

  getRecientes(pageSize = 3): Observable<EventoListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_inicio')
      .set('sort[order]', 'desc');
    return this.http.get<EventoListResponse>('/api/v1/public/eventos', { params });
  }

  getAll(pageSize = 50): Observable<EventoListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_inicio')
      .set('sort[order]', 'desc');
    return this.http.get<EventoListResponse>(this.baseUrl, { params });
  }

  getPaginado(pageIndex = 1, pageSize = 9): Observable<EventoListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_inicio')
      .set('sort[order]', 'desc');
    return this.http.get<EventoListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  getFotos(eventoId: number): Observable<EventoFoto[]> {
    return this.http.get<EventoFoto[]>(`${this.baseUrl}/${eventoId}/fotos`);
  }
}
