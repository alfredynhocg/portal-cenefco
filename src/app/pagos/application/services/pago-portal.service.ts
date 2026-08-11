import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import {
  IniciarPagoPayload, IniciarPagoResponse, IniciarPagoMultiplePayload,
  PagoEstadoResponse, BuscarCiResponse, MisPagosResponse,
} from '../../domain/models/pago-portal.model';

@Injectable({ providedIn: 'root' })
export class PagoPortalService {
  private http = inject(HttpClient);

  iniciarPago(payload: IniciarPagoPayload): Observable<IniciarPagoResponse> {
    return this.http.post<IniciarPagoResponse>('/api/public/pago/iniciar', payload);
  }

  iniciarPagoMultiple(payload: IniciarPagoMultiplePayload): Observable<IniciarPagoResponse[]> {
    const { items, nombre, appaterno, ci, expedido, email, telefono, success_url, cancel_url } = payload;
    const requests = items.map(item =>
      this.http.post<IniciarPagoResponse>('/api/public/pago/iniciar', {
        id_programa: item.id_programa,
        monto:       item.monto,
        nombre, appaterno, ci, expedido, email, telefono,
        id_fechapago: null,
        success_url, cancel_url,
      })
    );
    return forkJoin(requests);
  }

  getEstado(sessionId: number): Observable<PagoEstadoResponse> {
    return this.http.get<PagoEstadoResponse>(`/api/public/pago/estado/${sessionId}`);
  }

  buscarPorCi(ci: string): Observable<BuscarCiResponse | null> {
    return this.http.get<BuscarCiResponse | null>(
      `/api/v1/public/usuarios/buscar-ci`,
      { params: { ci } }
    );
  }

  getMisPagos(ci: string, email: string, expedido?: string): Observable<MisPagosResponse> {
    const params: Record<string, string> = { ci, email };
    if (expedido) params['expedido'] = expedido;
    return this.http.get<MisPagosResponse>('/api/v1/public/mis-pagos', { params });
  }
}
