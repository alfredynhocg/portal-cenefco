import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publicacion, PublicacionListResponse, TipoPublicacion } from '../../domain/models/publicacion.model';

@Injectable({ providedIn: 'root' })
export class PublicacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/public/publicaciones';

  getAll(pageSize = 200): Observable<PublicacionListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'titulo')
      .set('sort[order]', 'asc');
    return this.http.get<PublicacionListResponse>(this.baseUrl, { params });
  }

  getByTipo(tipo: TipoPublicacion, pageSize = 200): Observable<PublicacionListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('tipo', tipo)
      .set('sort[key]', 'titulo')
      .set('sort[order]', 'asc');
    return this.http.get<PublicacionListResponse>(this.baseUrl, { params });
  }

  getBySlug(tipo: string, slug: string): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.baseUrl}/${tipo}/slug/${slug}`);
  }
}
