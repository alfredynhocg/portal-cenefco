import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Testimonio {
  id: number;
  nombre: string;
  cargo: string | null;
  empresa: string | null;
  testimonio: string;
  calificacion: number | null;
  foto_url: string | null;
  foto_alt: string | null;
  destacado: boolean;
  orden: number;
  estado: string;
}

export interface TestimonioListResponse {
  data: Testimonio[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class TestimonioService {
  private http = inject(HttpClient);

  getAll(pageSize = 50): Observable<TestimonioListResponse> {
    return this.http.get<TestimonioListResponse>('/api/v1/public/testimonios', {
      params: { pageSize: pageSize.toString(), estado: 'publicado' }
    });
  }
}
