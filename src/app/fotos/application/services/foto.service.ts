import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FotoListResponse } from '../../domain/models/foto.model';

@Injectable({ providedIn: 'root' })
export class FotoService {
  private http = inject(HttpClient);

  getRecientes(pageSize = 8): Observable<FotoListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageIndex', 1);
    return this.http.get<FotoListResponse>('/api/v1/public/fotos', { params });
  }

  getPaginado(pageIndex = 1, pageSize = 12): Observable<FotoListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    return this.http.get<FotoListResponse>('/api/v1/public/fotos', { params });
  }
}
