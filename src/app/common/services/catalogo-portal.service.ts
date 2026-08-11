import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogoItemPublico, GradoAcademicoPublico, MedioPagoPublico, ProfesionPublico } from '../models/catalogo.model';

interface ExpedidoItem { id: number; nombre: string; }

export interface DatosCi {
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  ci: string | null;
  complemento: string | null;
  expedido_id: number | null;
  email: string | null;
  telefono: string | null;
}

@Injectable({ providedIn: 'root' })
export class CatalogoPortalService {
  private http = inject(HttpClient);

  getExpedidos(): Observable<{ data: ExpedidoItem[]; total: number }> {
    return this.http.get<{ data: ExpedidoItem[]; total: number }>('/api/v1/public/expedido', {
      params: { pageSize: '50' }
    });
  }

  getGradosAcademicos(): Observable<{ data: GradoAcademicoPublico[]; total: number }> {
    return this.http.get<{ data: GradoAcademicoPublico[]; total: number }>('/api/v1/public/grados-academicos');
  }

  getCiudades(): Observable<{ data: CatalogoItemPublico[]; total: number }> {
    return this.http.get<{ data: CatalogoItemPublico[]; total: number }>('/api/v1/public/catalogo-academico/ciudades');
  }

  getMediosPago(): Observable<{ data: MedioPagoPublico[]; total: number }> {
    return this.http.get<{ data: MedioPagoPublico[]; total: number }>('/api/v1/public/medios-pago');
  }

  getProfesiones(): Observable<{ data: ProfesionPublico[]; total: number }> {
    return this.http.get<{ data: ProfesionPublico[]; total: number }>('/api/v1/public/profesiones');
  }

  buscarPorCi(ci: string): Observable<DatosCi | null> {
    return this.http.get<DatosCi | null>('/api/v1/public/usuarios/buscar-ci', {
      params: { ci }
    });
  }

  uploadFile(file: File): Observable<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>('/api/v1/public/upload/file', fd);
  }
}
