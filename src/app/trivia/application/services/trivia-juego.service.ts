import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TriviaIniciarResponse, TriviaResponderResponse } from '../../domain/models/trivia.model';

@Injectable({ providedIn: 'root' })
export class TriviaJuegoService {
  private http = inject(HttpClient);

  iniciar(categoriaId: number): Observable<TriviaIniciarResponse> {
    return this.http.post<TriviaIniciarResponse>('/api/v1/trivia/partidas', { categoria_id: categoriaId });
  }

  responder(partidaId: number, preguntaId: number, opcionId: number | null, tiempoRespuestaMs: number): Observable<TriviaResponderResponse> {
    return this.http.post<TriviaResponderResponse>(`/api/v1/trivia/partidas/${partidaId}/responder`, {
      pregunta_id: preguntaId,
      opcion_id: opcionId,
      tiempo_respuesta_ms: tiempoRespuestaMs,
    });
  }
}
