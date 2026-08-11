import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CertConfigPortal, CertSolicitud, CrearSolicitudesPayload } from '../../domain/models/cert-config.model';

@Injectable({ providedIn: 'root' })
export class CertConfigService {
  private http = inject(HttpClient);

  getConfig(programaId: number): Observable<CertConfigPortal> {
    return this.http.get<CertConfigPortal>(`/api/v1/public/cert-config/${programaId}`);
  }

  crearSolicitudes(payload: CrearSolicitudesPayload): Observable<{ solicitudes: CertSolicitud[] }> {
    return this.http.post<{ solicitudes: CertSolicitud[] }>('/api/v1/public/cert-solicitudes', payload);
  }

  subirComprobante(solicitudId: number, comprobanteUrl: string): Observable<any> {
    return this.http.patch(`/api/v1/public/cert-solicitudes/${solicitudId}/comprobante`, { comprobante_url: comprobanteUrl });
  }

  uploadFile(file: File): Observable<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>('/api/v1/public/upload/file', fd);
  }
}
