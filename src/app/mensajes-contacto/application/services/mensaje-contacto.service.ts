import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateMensajeContacto, MensajeContacto } from '../../domain/models/mensaje-contacto.model';

@Injectable({ providedIn: 'root' })
export class MensajeContactoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/mensajes-contacto';

  enviar(data: CreateMensajeContacto): Observable<MensajeContacto> {
    return this.http.post<MensajeContacto>(this.baseUrl, data);
  }
}
