import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificado } from '../../domain/models/certificado.model';

@Injectable({ providedIn: 'root' })
export class CertificadoService {
    private http = inject(HttpClient);
    private readonly baseUrl = '/api/v1/portal/certificados';

    verificar(codigo: string): Observable<Certificado> {
        return this.http.get<Certificado>(`${this.baseUrl}/codigo/${encodeURIComponent(codigo.trim().toUpperCase())}`);
    }
}
