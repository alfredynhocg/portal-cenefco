import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Convenio {
  id: number;
  nombre: string;
  institucion: string | null;
  logo_url: string | null;
}

export interface ConvenioDetalle extends Convenio {
  tipo: string | null;
  descripcion: string | null;
  responsable: string | null;
  contacto_email: string | null;
  contacto_telefono: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  documento_url: string | null;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class ConvenioService {
  private http = inject(HttpClient);

  getAll(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>('/api/v1/public/convenios');
  }

  getById(id: number): Observable<ConvenioDetalle> {
    return this.http.get<ConvenioDetalle>(`/api/v1/public/convenios/${id}`);
  }
}
