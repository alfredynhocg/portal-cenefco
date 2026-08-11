import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursoPasado, CursoPasadoListResponse } from '../../domain/models/curso-pasado.model';

@Injectable({ providedIn: 'root' })
export class CursoPasadoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/cursos-pasados';

  getAll(pageIndex = 1, pageSize = 12, query = ''): Observable<CursoPasadoListResponse> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize);
    if (query) params = params.set('query', query);
    return this.http.get<CursoPasadoListResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<CursoPasado> {
    return this.http.get<CursoPasado>(`${this.baseUrl}/${slug}`);
  }
}
