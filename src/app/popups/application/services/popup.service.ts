import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Popup } from '../../domain/models/popup.model';

@Injectable({ providedIn: 'root' })
export class PopupPortalService {
  private http = inject(HttpClient);
  private readonly url = '/api/v1/portal/popups';

  getActivos(): Observable<Popup[]> {
    return this.http
      .get<{ data: Popup[]; total: number }>(this.url, { params: { activo: true } })
      .pipe(map(res => res.data ?? []));
  }
}
