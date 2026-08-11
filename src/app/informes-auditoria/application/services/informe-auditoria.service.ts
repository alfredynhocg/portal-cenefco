import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformeAuditoriaListResponse } from '../../domain/models/informe-auditoria.model';

@Injectable({ providedIn: 'root' })
export class InformeAuditoriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/descargables';

  getPaginado(pageIndex = 1, pageSize = 12): Observable<InformeAuditoriaListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('soloPublicados', 'true')
      .set('sort[key]', 'fecha')
      .set('sort[order]', 'desc');
    return this.http.get<InformeAuditoriaListResponse>(this.baseUrl, { params });
  }
}
