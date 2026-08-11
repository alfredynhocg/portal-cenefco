import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area, AreaConCursos } from '../../domain/models/area.model';

@Injectable({ providedIn: 'root' })
export class AreaPortalService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/public/areas';

  getAll(): Observable<Area[]> {
    return this.http.get<Area[]>(this.baseUrl);
  }

  getBySlug(slug: string): Observable<AreaConCursos> {
    return this.http.get<AreaConCursos>(`${this.baseUrl}/${slug}`);
  }
}
