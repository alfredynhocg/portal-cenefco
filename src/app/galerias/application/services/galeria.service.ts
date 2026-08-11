import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GaleriaItemsResponse } from '../../domain/models/galeria.model';

@Injectable({ providedIn: 'root' })
export class GaleriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/galeria-categorias';

  getItems(pageSize = 8): Observable<GaleriaItemsResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'orden')
      .set('sort[order]', 'asc');
    return this.http.get<GaleriaItemsResponse>(this.baseUrl, { params });
  }
}
