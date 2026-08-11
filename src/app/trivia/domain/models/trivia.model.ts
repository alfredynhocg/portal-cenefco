export interface TriviaCategoria {
  id:           number;
  nombre:       string;
  slug:         string;
  descripcion?: string | null;
  imagen_url?:  string | null;
  color?:       string | null;
  orden:        number;
  activo:       boolean;
}

export interface TriviaCategoriaListResponse {
  data:  TriviaCategoria[];
  total: number;
}

export interface TriviaOpcionJuego {
  id:    number;
  texto: string;
}

export interface TriviaPreguntaJuego {
  id:                      number;
  categoria_id:            number;
  nivel_id:                number;
  enunciado:               string;
  imagen_url?:             string | null;
  tiempo_limite_segundos:  number;
  opciones:                TriviaOpcionJuego[];
}

export interface TriviaPartidaEstado {
  partida_id:      number;
  jugador_id:      number;
  categoria_id:    number;
  estado_partida:  'en_curso' | 'finalizada';
  puntaje:         number;
  vidas:           number;
  estado_jugador:  'jugando' | 'ganador' | 'perdedor';
}

export interface TriviaIniciarResponse {
  partida:  TriviaPartidaEstado;
  pregunta: TriviaPreguntaJuego;
}

export interface TriviaResponderResponse {
  es_correcta: boolean;
  partida:     TriviaPartidaEstado;
  pregunta:    TriviaPreguntaJuego | null;
}

export interface TriviaRankingItem {
  posicion:          number;
  usuario_id:        number;
  nombre:            string;
  avatar_url?:       string | null;
  puntaje_total:     number;
  partidas_jugadas:  number;
  partidas_ganadas:  number;
}

export interface TriviaRankingResponse {
  data: TriviaRankingItem[];
}

export interface TriviaPremio {
  id:            number;
  nombre:        string;
  descripcion?:  string | null;
  tipo:          'souvenir' | 'descuento' | 'otro';
  imagen_url?:   string | null;
  costo_puntos:  number;
  stock:         number | null;
  activo:        boolean;
  orden:         number;
}

export interface TriviaPremioListResponse {
  data: TriviaPremio[];
}

export interface TriviaSaldo {
  puntaje_total:     number;
  puntos_gastados:   number;
  saldo_disponible:  number;
}

export interface TriviaCanje {
  id:                 number;
  codigo:             string;
  estado:             'pendiente' | 'entregado' | 'cancelado';
  costo_puntos:       number;
  nota?:              string | null;
  created_at:         string;
  premio_id:          number;
  premio_nombre:      string;
  premio_tipo:        string;
  premio_imagen_url?: string | null;
}

export interface TriviaCanjeListResponse {
  data: TriviaCanje[];
}

export interface TriviaDueloRival {
  usuario_id:        number;
  nombre:            string;
  avatar_url:        string | null;
  puntaje:           number;
  pregunta_indice:   number;
  estado:            string;
}

export interface TriviaDueloEstado {
  partida_id:          number;
  codigo_sala:         string;
  estado_partida:      'esperando' | 'en_curso' | 'finalizada';
  categoria_id:        number;
  total_preguntas:     number;
  mi_puntaje:          number;
  mi_pregunta_indice:  number;
  mi_estado:           string;
  rival:               TriviaDueloRival | null;
  pregunta_actual:     TriviaPreguntaJuego | null;
  resultado:           'ganaste' | 'perdiste' | 'empate' | null;
}
