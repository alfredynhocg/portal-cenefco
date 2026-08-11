import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarioAcademicoListResponse } from '../../domain/models/calendario-academico.model';

@Injectable({ providedIn: 'root' })
export class CalendarioAcademicoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/calendario-academico';

  getPaginado(pageIndex = 1, pageSize = 9): Observable<CalendarioAcademicoListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_inicio')
      .set('sort[order]', 'asc');
    return this.http.get<CalendarioAcademicoListResponse>(this.baseUrl, { params });
  }

  getAll(pageSize = 500): Observable<CalendarioAcademicoListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_inicio')
      .set('sort[order]', 'asc');
    return this.http.get<CalendarioAcademicoListResponse>(this.baseUrl, { params });
  }
}
