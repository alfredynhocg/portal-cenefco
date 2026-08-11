import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Correspondencia } from '../../domain/models/correspondencia.model';

@Injectable({ providedIn: 'root' })
export class CorrespondenciaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/portal/certificados';

  consultar(cite: string, captchaKey: string, captchaValue: string): Observable<Correspondencia> {
    return this.http.get<Correspondencia>(
      `${this.baseUrl}/${encodeURIComponent(cite.trim().toUpperCase())}`,
      { params: { captcha_key: captchaKey, captcha_value: captchaValue } }
    );
  }
}
