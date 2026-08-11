import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia, NoticiaListResponse } from '../../domain/models/noticia.model';

@Injectable({ providedIn: 'root' })
export class NoticiaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/noticias';

  getRecientes(pageSize = 3): Observable<NoticiaListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_publicacion')
      .set('sort[order]', 'desc');
    return this.http.get<NoticiaListResponse>(this.baseUrl, { params });
  }

  getPaginado(pageIndex = 1, pageSize = 9): Observable<NoticiaListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex)
      .set('pageSize', pageSize)
      .set('sort[key]', 'fecha_publicacion')
      .set('sort[order]', 'desc');
    return this.http.get<NoticiaListResponse>(this.baseUrl, { params });
  }

  getBySlug(slug: string): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.baseUrl}/slug/${slug}`);
  }
}
