import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HitoInstitucionalListResponse } from '../../domain/models/hito-institucional.model';

@Injectable({ providedIn: 'root' })
export class HitoInstitucionalService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/hitos-institucionales';

  getAll(): Observable<HitoInstitucionalListResponse> {
    const params = new HttpParams()
      .set('soloActivos', 'true')
      .set('pageSize', 100)
      .set('pageIndex', 1)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<HitoInstitucionalListResponse>(this.baseUrl, { params });
  }
}
