import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TriviaCategoriaListResponse, TriviaPremioListResponse, TriviaRankingResponse } from '../../domain/models/trivia.model';

@Injectable({ providedIn: 'root' })
export class TriviaService {
  private http = inject(HttpClient);

  getCategorias(): Observable<TriviaCategoriaListResponse> {
    return this.http.get<TriviaCategoriaListResponse>('/api/v1/portal/trivia/categorias', {
      params: { pageSize: 50 },
    });
  }

  getRanking(limite = 20): Observable<TriviaRankingResponse> {
    return this.http.get<TriviaRankingResponse>('/api/v1/portal/trivia/ranking', {
      params: { limite },
    });
  }

  getPremios(): Observable<TriviaPremioListResponse> {
    return this.http.get<TriviaPremioListResponse>('/api/v1/portal/trivia/premios');
  }
}
