import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boletin, BoletinListResponse } from '../../domain/models/boletin.model';

@Injectable({ providedIn: 'root' })
export class BoletinService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/public/boletines';

  getRecientes(pageSize = 3): Observable<BoletinListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageIndex', 1);
    return this.http.get<BoletinListResponse>(this.baseUrl, { params });
  }

  getPaginado(pageIndex = 1, pageSize = 9): Observable<BoletinListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    return this.http.get<BoletinListResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<Boletin> {
    return this.http.get<Boletin>(`${this.baseUrl}/slug/${slug}`);
  }
}
