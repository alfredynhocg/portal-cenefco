import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreguntaFrecuenteListResponse } from '../../domain/models/pregunta-frecuente.model';

@Injectable({ providedIn: 'root' })
export class PreguntaFrecuenteService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/preguntas-frecuentes';

  getAll(pageSize = 20): Observable<PreguntaFrecuenteListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<PreguntaFrecuenteListResponse>(this.baseUrl, { params });
  }
}
