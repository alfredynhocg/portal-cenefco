import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RedSocialListResponse } from '../../domain/models/red-social.model';

@Injectable({ providedIn: 'root' })
export class RedSocialService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/redes-sociales';

  getActivas(): Observable<RedSocialListResponse> {
    const params = new HttpParams()
      .set('pageSize', 50)
      .set('pageIndex', 1)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<RedSocialListResponse>(this.baseUrl, { params });
  }
}
