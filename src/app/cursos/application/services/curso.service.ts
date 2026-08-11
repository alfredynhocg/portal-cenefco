import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso, CursoListResponse, CursoParticipantes } from '../../domain/models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/public/cursos';

  getAll(pageSize = 6): Observable<CursoListResponse> {
    const params = new HttpParams()
      .set('pageSize', pageSize)
      .set('sort[key]', 'nombre_programa')
      .set('sort[order]', 'asc');
    return this.http.get<CursoListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/${id}`);
  }

  getBySlug(slug: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/slug/${slug}`);
  }

  getParticipantesBySlug(slug: string): Observable<CursoParticipantes> {
    return this.http.get<CursoParticipantes>(`${this.baseUrl}/slug/${slug}/participantes`);
  }
}
