import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CifraInstitucional } from '../../domain/models/cifra-institucional.model';

@Injectable({ providedIn: 'root' })
export class CifraInstitucionalService {
  private http = inject(HttpClient);

  getAll(): Observable<CifraInstitucional[]> {
    return this.http.get<CifraInstitucional[]>('/api/v1/public/cifras-institucionales');
  }
}
