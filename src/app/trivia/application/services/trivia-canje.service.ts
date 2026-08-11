import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TriviaCanjeListResponse, TriviaSaldo } from '../../domain/models/trivia.model';

@Injectable({ providedIn: 'root' })
export class TriviaCanjeService {
  private http = inject(HttpClient);

  getSaldo(): Observable<TriviaSaldo> {
    return this.http.get<TriviaSaldo>('/api/v1/trivia/saldo');
  }

  canjear(premioId: number): Observable<unknown> {
    return this.http.post('/api/v1/trivia/canjes', { premio_id: premioId });
  }

  misCanjes(): Observable<TriviaCanjeListResponse> {
    return this.http.get<TriviaCanjeListResponse>('/api/v1/trivia/canjes');
  }
}
