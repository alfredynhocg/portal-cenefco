import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ConfiguracionResponse, ConfiguracionPublicaResponse } from '../../domain/models/configuracion.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/configuracion';
  private readonly baseUrlPublica = '/api/v1/portal/configuracion';

  private publica$?: Observable<ConfiguracionResponse>;
  private publicaWeb$?: Observable<ConfiguracionPublicaResponse>;

  getPublica(): Observable<ConfiguracionResponse> {
    if (!this.publica$) {
      this.publica$ = this.http.get<ConfiguracionResponse>(this.baseUrl).pipe(
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.publica$;
  }

  getPublicaWeb(): Observable<ConfiguracionPublicaResponse> {
    if (!this.publicaWeb$) {
      this.publicaWeb$ = this.http.get<ConfiguracionPublicaResponse>(this.baseUrlPublica).pipe(
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.publicaWeb$;
  }
}
