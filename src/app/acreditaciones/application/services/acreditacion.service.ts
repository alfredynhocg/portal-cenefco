import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcreditacionListResponse } from '../../domain/models/acreditacion.model';

@Injectable({ providedIn: 'root' })
export class AcreditacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/acreditaciones';

  getAll(): Observable<AcreditacionListResponse> {
    const params = new HttpParams()
      .set('activo', 'true')
      .set('pageSize', 100)
      .set('pageIndex', 1);
    return this.http.get<AcreditacionListResponse>(this.baseUrl, { params });
  }
}
