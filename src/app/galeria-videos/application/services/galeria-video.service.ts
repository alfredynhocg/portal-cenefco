import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GaleriaVideoListResponse } from '../../domain/models/galeria-video.model';

@Injectable({ providedIn: 'root' })
export class GaleriaVideoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/galeria-videos';

  getPaginado(pageIndex = 1, pageSize = 12): Observable<GaleriaVideoListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<GaleriaVideoListResponse>(this.baseUrl, { params });
  }
}
