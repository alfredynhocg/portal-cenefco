import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo, ArticuloListResponse } from '../../domain/models/articulo.model';

@Injectable({ providedIn: 'root' })
export class ArticuloService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/articulos';

  getRecientes(pageSize = 6): Observable<ArticuloListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageIndex', 1)
      .set('estado_web', 'publicado');
    return this.http.get<ArticuloListResponse>(this.baseUrl, { params });
  }

  getPaginado(pageIndex = 1, pageSize = 9): Observable<ArticuloListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('estado_web', 'publicado')
      .set('sort[key]', 'fecha_publicacion')
      .set('sort[order]', 'desc');
    return this.http.get<ArticuloListResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.baseUrl}/slug/${slug}`);
  }
}
