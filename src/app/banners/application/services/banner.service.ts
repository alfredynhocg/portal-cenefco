import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner, BannerListResponse } from '../../domain/models/banner.model';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/banners';

  getActivos(): Observable<BannerListResponse> {
    const params = new HttpParams()
      .set('pageSize', '50')
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<BannerListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.baseUrl}/${id}`);
  }
}
