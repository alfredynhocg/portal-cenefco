import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TriviaDueloEstado } from '../../domain/models/trivia.model';

@Injectable({ providedIn: 'root' })
export class TriviaDueloService {
  private http = inject(HttpClient);

  crear(categoriaId: number): Observable<TriviaDueloEstado> {
    return this.http.post<TriviaDueloEstado>('/api/v1/trivia/duelos', { categoria_id: categoriaId });
  }

  unirse(codigoSala: string): Observable<TriviaDueloEstado> {
    return this.http.post<TriviaDueloEstado>('/api/v1/trivia/duelos/unirse', { codigo_sala: codigoSala });
  }

  responder(partidaId: number, preguntaId: number, opcionId: number | null, tiempoRespuestaMs: number): Observable<TriviaDueloEstado> {
    return this.http.post<TriviaDueloEstado>(`/api/v1/trivia/duelos/${partidaId}/responder`, {
      pregunta_id: preguntaId,
      opcion_id: opcionId,
      tiempo_respuesta_ms: tiempoRespuestaMs,
    });
  }

  estado(partidaId: number): Observable<TriviaDueloEstado> {
    return this.http.get<TriviaDueloEstado>(`/api/v1/trivia/duelos/${partidaId}/estado`);
  }
}
