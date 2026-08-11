import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EfectosActivosResponse } from '../../domain/models/efecto-especial.model';

@Injectable({ providedIn: 'root' })
export class EfectoEspecialService {
  private http = inject(HttpClient);

  getActivos(): Observable<EfectosActivosResponse> {
    return this.http.get<EfectosActivosResponse>('/api/v1/public/efectos-especiales');
  }
}
