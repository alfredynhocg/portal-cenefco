import { Component, OnDestroy, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { AuthService } from '../../../auth/application/services/auth.service';
import { TriviaService } from '../../application/services/trivia.service';
import { TriviaJuegoService } from '../../application/services/trivia-juego.service';
import { TriviaCanjeService } from '../../application/services/trivia-canje.service';
import { TriviaDueloService } from '../../application/services/trivia-duelo.service';
import { TriviaAudioService } from '../../application/services/trivia-audio.service';
import { TriviaCanje, TriviaCategoria, TriviaDueloEstado, TriviaPartidaEstado, TriviaPremio, TriviaPreguntaJuego, TriviaRankingItem, TriviaSaldo } from '../../domain/models/trivia.model';
import { TvIconComponent, TvIconName, colorParaCategoria, iconoParaCategoria } from './tv-icon.component';

type Fase = 'cargando' | 'necesita-login' | 'sin-categorias' | 'rueda' | 'girando' | 'jugando' | 'resultado' | 'ranking' | 'premios'
  | 'duelo-menu' | 'duelo-esperando' | 'duelo-jugando' | 'duelo-resultado';
type EstadoCortina = 'oculta' | 'cerrando' | 'cerrada' | 'abriendo';

const CORTINA_MS = 420;
const CORTINA_HOLD_MS = 550;

interface ConfetiPieza {
  left: number;
  delay: number;
  duracion: number;
  color: string;
  rotacion: number;
}

const RUEDA_COLORES = ['#128AA2', '#FC8900', '#0e6f85', '#d97706', '#0891b2', '#c2410c'];
const CONFETI_COLORES = ['#128AA2', '#FC8900', '#facc15', '#34d399', '#60a5fa', '#f472b6'];
const DURACION_GIRO_MS = 4200;

@Component({
  selector: 'app-trivia',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, TvIconComponent],
  templateUrl: './trivia.component.html',
})
export class TriviaComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private triviaService = inject(TriviaService);
  private juegoService = inject(TriviaJuegoService);
  private canjeService = inject(TriviaCanjeService);
  private dueloService = inject(TriviaDueloService);
  private audio = inject(TriviaAudioService);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  fase = signal<Fase>('cargando');
  cortina = signal<EstadoCortina>('oculta');
  error = signal<string | null>(null);

  categorias = signal<TriviaCategoria[]>([]);
  categoriaSeleccionada = signal<TriviaCategoria | null>(null);
  rotacionRueda = signal(0);

  partida = signal<TriviaPartidaEstado | null>(null);
  preguntaActual = signal<TriviaPreguntaJuego | null>(null);
  opcionSeleccionada = signal<number | null>(null);
  respondiendo = signal(false);
  feedback = signal<'correcta' | 'incorrecta' | null>(null);
  tiempoRestante = signal(0);

  vidaPerdida = signal(false);
  puntajeSubio = signal(false);
  confeti = signal<ConfetiPieza[]>([]);

  ranking = signal<TriviaRankingItem[] | null>(null);
  cargandoRanking = signal(false);
  private faseAntesDeRanking: Fase = 'rueda';

  premios = signal<TriviaPremio[] | null>(null);
  misCanjes = signal<TriviaCanje[] | null>(null);
  saldo = signal<TriviaSaldo | null>(null);
  cargandoPremios = signal(false);
  premioAConfirmar = signal<number | null>(null);
  canjeando = signal<number | null>(null);
  mensajeCanje = signal<string | null>(null);
  private faseAntesDePremios: Fase = 'rueda';

  duelo = signal<TriviaDueloEstado | null>(null);
  dueloModo = signal<'crear' | 'unirse'>('crear');
  dueloCategoriaId = signal<number | null>(null);
  dueloCodigoInput = signal('');
  dueloError = signal<string | null>(null);
  dueloCreando = signal(false);
  dueloUniendo = signal(false);
  dueloOpcionSeleccionada = signal<number | null>(null);
  dueloRespondiendo = signal(false);
  dueloFeedback = signal<'correcta' | 'incorrecta' | null>(null);
  dueloTiempoRestante = signal(0);
  private dueloPreguntaIdCargada: number | null = null;
  private dueloPollId: ReturnType<typeof setInterval> | null = null;
  private dueloTimerId: ReturnType<typeof setInterval> | null = null;
  private dueloPollEnCurso = false;

  readonly miUsuarioId = this.auth.currentUser()?.id ?? null;
  readonly LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
  readonly VIDAS_MAX = 3;

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.fase.set('necesita-login');
      return;
    }

    this.triviaService.getCategorias().subscribe({
      next: (res) => {
        this.categorias.set(res.data.filter(c => c.activo));
        this.fase.set(this.categorias().length ? 'rueda' : 'sin-categorias');
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías. Intenta de nuevo más tarde.');
        this.fase.set('sin-categorias');
      },
    });
  }

  ngOnDestroy(): void {
    this.limpiarTemporizador();
    this.limpiarTemporizadorDuelo();
    this.detenerPollingDuelo();
    this.audio.detenerMusicaFondo();
  }

  readonly sonidoHabilitado = this.audio.habilitado;

  toggleSonido(): void {
    this.audio.toggleSonido();
  }

  iconoCategoria(nombre: string): TvIconName {
    return iconoParaCategoria(nombre);
  }

  colorCategoria(nombre: string): string {
    return colorParaCategoria(nombre);
  }

  private transicionarA(nuevaFase: Fase, cambios?: () => void): void {
    this.cortina.set('cerrando');
    setTimeout(() => {
      this.cortina.set('cerrada');
      cambios?.();
      this.fase.set(nuevaFase);

      setTimeout(() => {
        this.cortina.set('abriendo');
        setTimeout(() => this.cortina.set('oculta'), CORTINA_MS);
      }, CORTINA_HOLD_MS);
    }, CORTINA_MS);
  }

  colorSector(i: number): string {
    return RUEDA_COLORES[i % RUEDA_COLORES.length];
  }

  gradienteRueda = computed(() => {
    const cats = this.categorias();
    if (!cats.length) return 'transparent';

    const anguloPorSector = 360 / cats.length;
    const stops = cats.map((_, i) => {
      const desde = i * anguloPorSector;
      const hasta = (i + 1) * anguloPorSector;
      return `${this.colorSector(i)} ${desde}deg ${hasta}deg`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  });

  anguloEtiqueta(i: number): number {
    const anguloPorSector = 360 / this.categorias().length;
    return i * anguloPorSector + anguloPorSector / 2;
  }

  girar(): void {
    if (this.fase() !== 'rueda') return;
    const cats = this.categorias();
    if (!cats.length) return;

    const indice = Math.floor(Math.random() * cats.length);
    const anguloPorSector = 360 / cats.length;
    const centroSector = indice * anguloPorSector + anguloPorSector / 2;
    const objetivoMod = (360 - centroSector) % 360;

    const actual = this.rotacionRueda();
    const base = actual - (actual % 360);
    const nuevaRotacion = base + 360 * 5 + objetivoMod;

    this.error.set(null);
    this.fase.set('girando');
    this.rotacionRueda.set(nuevaRotacion);
    this.audio.girar();

    setTimeout(() => {
      const categoria = cats[indice];
      this.categoriaSeleccionada.set(categoria);
      this.dispararConfeti(24);
      this.iniciarPartida(categoria.id);
    }, DURACION_GIRO_MS);
  }

  private iniciarPartida(categoriaId: number): void {
    this.juegoService.iniciar(categoriaId).subscribe({
      next: (res) => {
        this.partida.set(res.partida);
        this.preguntaActual.set(res.pregunta);
        this.opcionSeleccionada.set(null);
        this.feedback.set(null);
        this.fase.set('jugando');
        this.audio.iniciarMusicaFondo();
        this.iniciarTemporizador(res.pregunta.tiempo_limite_segundos);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error?.error ?? 'No se pudo iniciar la partida. Intenta de nuevo.');
        this.fase.set('rueda');
      },
    });
  }

  responder(opcionId: number | null): void {
    const partida = this.partida();
    const pregunta = this.preguntaActual();
    if (!partida || !pregunta || this.respondiendo() || this.opcionSeleccionada() !== null) return;

    this.limpiarTemporizador();
    this.opcionSeleccionada.set(opcionId);
    this.respondiendo.set(true);

    const vidasAntes = partida.vidas;
    const puntajeAntes = partida.puntaje;
    const tiempoRespuestaMs = (pregunta.tiempo_limite_segundos - this.tiempoRestante()) * 1000;

    this.juegoService.responder(partida.partida_id, pregunta.id, opcionId, tiempoRespuestaMs).subscribe({
      next: (res) => {
        this.feedback.set(res.es_correcta ? 'correcta' : 'incorrecta');
        this.partida.set(res.partida);

        if (res.es_correcta) this.audio.acierto(); else this.audio.error();
        if (res.partida.vidas < vidasAntes) {
          this.animarBrevemente(this.vidaPerdida);
          this.audio.perderVida();
        }
        if (res.partida.puntaje > puntajeAntes) this.animarBrevemente(this.puntajeSubio);

        setTimeout(() => {
          this.respondiendo.set(false);
          this.feedback.set(null);
          this.opcionSeleccionada.set(null);

          if (res.partida.estado_partida === 'finalizada' || !res.pregunta) {
            this.audio.detenerMusicaFondo();
            const gano = res.partida.estado_jugador === 'ganador';
            if (gano) { this.dispararConfeti(60); this.audio.victoria(); } else { this.audio.derrota(); }
            this.transicionarA('resultado');
          } else {
            this.preguntaActual.set(res.pregunta);
            this.iniciarTemporizador(res.pregunta.tiempo_limite_segundos);
          }
        }, 1400);
      },
      error: () => {
        this.respondiendo.set(false);
        this.opcionSeleccionada.set(null);
        this.error.set('No se pudo enviar tu respuesta. Intenta de nuevo.');
      },
    });
  }

  verRanking(): void {
    this.audio.clic();
    this.faseAntesDeRanking = this.fase() === 'ranking' ? this.faseAntesDeRanking : this.fase();
    this.transicionarA('ranking', () => {
      if (this.ranking() === null) {
        this.cargandoRanking.set(true);
        this.triviaService.getRanking().subscribe({
          next: (res) => {
            this.ranking.set(res.data);
            this.cargandoRanking.set(false);
          },
          error: () => {
            this.ranking.set([]);
            this.cargandoRanking.set(false);
          },
        });
      }
    });
  }

  cerrarRanking(): void {
    this.audio.clic();
    this.transicionarA(this.faseAntesDeRanking);
  }

  verPremios(): void {
    this.audio.clic();
    this.faseAntesDePremios = this.fase() === 'premios' ? this.faseAntesDePremios : this.fase();
    this.transicionarA('premios', () => {
      this.mensajeCanje.set(null);
      this.premioAConfirmar.set(null);
      this.cargandoPremios.set(true);
      this.triviaService.getPremios().subscribe({
        next: (res) => this.premios.set(res.data),
        error: () => this.premios.set([]),
      });
      this.canjeService.getSaldo().subscribe({
        next: (res) => this.saldo.set(res),
        error: () => this.saldo.set(null),
      });
      this.canjeService.misCanjes().subscribe({
        next: (res) => { this.misCanjes.set(res.data); this.cargandoPremios.set(false); },
        error: () => { this.misCanjes.set([]); this.cargandoPremios.set(false); },
      });
    });
  }

  cerrarPremios(): void {
    this.audio.clic();
    this.transicionarA(this.faseAntesDePremios);
  }

  pedirConfirmacionCanje(premioId: number): void {
    this.mensajeCanje.set(null);
    this.premioAConfirmar.set(premioId);
  }

  cancelarConfirmacionCanje(): void {
    this.premioAConfirmar.set(null);
  }

  confirmarCanje(premio: TriviaPremio): void {
    this.canjeando.set(premio.id);
    this.canjeService.canjear(premio.id).subscribe({
      next: () => {
        this.audio.acierto();
        this.dispararConfeti(30);
        this.mensajeCanje.set(`¡Canjeaste "${premio.nombre}"! Muestra tu código en secretaría para recogerlo.`);
        this.premioAConfirmar.set(null);
        this.canjeando.set(null);

        this.canjeService.getSaldo().subscribe({ next: (res) => this.saldo.set(res) });
        this.canjeService.misCanjes().subscribe({ next: (res) => this.misCanjes.set(res.data) });
        this.triviaService.getPremios().subscribe({ next: (res) => this.premios.set(res.data) });
      },
      error: (err: HttpErrorResponse) => {
        this.mensajeCanje.set(err.error?.error ?? 'No se pudo canjear el premio. Intenta de nuevo.');
        this.premioAConfirmar.set(null);
        this.canjeando.set(null);
      },
    });
  }

  jugarDeNuevo(): void {
    this.audio.clic();
    this.detenerPollingDuelo();
    this.limpiarTemporizadorDuelo();
    this.transicionarA('rueda', () => {
      this.partida.set(null);
      this.preguntaActual.set(null);
      this.categoriaSeleccionada.set(null);
      this.error.set(null);
      this.duelo.set(null);
      this.dueloPreguntaIdCargada = null;
    });
  }

  private animarBrevemente(sig: WritableSignal<boolean>): void {
    sig.set(true);
    setTimeout(() => sig.set(false), 650);
  }

  private dispararConfeti(cantidad: number): void {
    this.confeti.set(Array.from({ length: cantidad }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duracion: 1.8 + Math.random() * 1.2,
      color: CONFETI_COLORES[Math.floor(Math.random() * CONFETI_COLORES.length)],
      rotacion: Math.random() * 360,
    })));
    setTimeout(() => this.confeti.set([]), 3200);
  }

  private iniciarTemporizador(segundos: number): void {
    this.limpiarTemporizador();
    this.tiempoRestante.set(segundos);
    this.intervalId = setInterval(() => {
      const actual = this.tiempoRestante();
      if (actual <= 1) {
        this.limpiarTemporizador();
        this.tiempoRestante.set(0);
        this.responder(null);
        return;
      }
      const restante = actual - 1;
      this.tiempoRestante.set(restante);
      if (restante > 0 && restante <= 5) this.audio.tick();
    }, 1000);
  }

  private limpiarTemporizador(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }


  verDuelo(): void {
    this.audio.clic();
    this.dueloError.set(null);
    this.dueloModo.set('crear');
    this.dueloCategoriaId.set(null);
    this.dueloCodigoInput.set('');
    this.transicionarA('duelo-menu');
  }

  cerrarDuelo(): void {
    this.audio.clic();
    this.detenerPollingDuelo();
    this.limpiarTemporizadorDuelo();
    this.duelo.set(null);
    this.dueloPreguntaIdCargada = null;
    this.transicionarA('rueda');
  }

  seleccionarModoDuelo(modo: 'crear' | 'unirse'): void {
    this.dueloModo.set(modo);
    this.dueloError.set(null);
  }

  seleccionarCategoriaDuelo(id: number): void {
    this.dueloCategoriaId.set(id);
  }

  onCodigoDueloInput(event: Event): void {
    this.dueloCodigoInput.set((event.target as HTMLInputElement).value.toUpperCase());
  }

  crearSalaDuelo(): void {
    const categoriaId = this.dueloCategoriaId();
    if (!categoriaId || this.dueloCreando()) return;

    this.dueloError.set(null);
    this.dueloCreando.set(true);
    this.dueloService.crear(categoriaId).subscribe({
      next: (res) => {
        this.dueloCreando.set(false);
        this.duelo.set(res);
        this.transicionarA('duelo-esperando', () => this.iniciarPollingDuelo(res.partida_id));
      },
      error: (err: HttpErrorResponse) => {
        this.dueloCreando.set(false);
        this.dueloError.set(err.error?.error ?? 'No se pudo crear la sala. Intenta de nuevo.');
      },
    });
  }

  unirseSalaDuelo(): void {
    const codigo = this.dueloCodigoInput().trim();
    if (!codigo || this.dueloUniendo()) return;

    this.dueloError.set(null);
    this.dueloUniendo.set(true);
    this.dueloService.unirse(codigo).subscribe({
      next: (res) => {
        this.dueloUniendo.set(false);
        this.duelo.set(res);
        this.transicionarA('duelo-jugando', () => {
          this.aplicarEstadoDuelo(res);
          this.iniciarPollingDuelo(res.partida_id);
        });
      },
      error: (err: HttpErrorResponse) => {
        this.dueloUniendo.set(false);
        this.dueloError.set(err.error?.error ?? 'No se pudo unir a la sala. Verifica el código.');
      },
    });
  }

  copiarCodigoSala(): void {
    const codigo = this.duelo()?.codigo_sala;
    if (!codigo) return;
    navigator.clipboard?.writeText(codigo).catch(() => {});
  }

  responderDuelo(opcionId: number | null): void {
    const d = this.duelo();
    const pregunta = d?.pregunta_actual;
    if (!d || !pregunta || this.dueloRespondiendo() || this.dueloOpcionSeleccionada() !== null) return;

    this.limpiarTemporizadorDuelo();
    this.dueloOpcionSeleccionada.set(opcionId);
    this.dueloRespondiendo.set(true);

    const puntajeAntes = d.mi_puntaje;
    const tiempoRespuestaMs = (pregunta.tiempo_limite_segundos - this.dueloTiempoRestante()) * 1000;

    this.dueloService.responder(d.partida_id, pregunta.id, opcionId, tiempoRespuestaMs).subscribe({
      next: (res) => {
        const acerte = res.mi_puntaje > puntajeAntes;
        this.dueloFeedback.set(acerte ? 'correcta' : 'incorrecta');
        if (acerte) this.audio.acierto(); else this.audio.error();

        setTimeout(() => {
          this.dueloRespondiendo.set(false);
          this.dueloFeedback.set(null);
          this.dueloOpcionSeleccionada.set(null);
          this.aplicarEstadoDuelo(res);
        }, 1400);
      },
      error: () => {
        this.dueloRespondiendo.set(false);
        this.dueloOpcionSeleccionada.set(null);
        this.dueloError.set('No se pudo enviar tu respuesta. Intenta de nuevo.');
      },
    });
  }

  private aplicarEstadoDuelo(res: TriviaDueloEstado): void {
    this.duelo.set(res);

    if (res.estado_partida === 'finalizada') {
      this.detenerPollingDuelo();
      this.limpiarTemporizadorDuelo();
      if (this.fase() !== 'duelo-resultado') {
        if (res.resultado === 'ganaste') { this.dispararConfeti(60); this.audio.victoria(); }
        else if (res.resultado === 'perdiste') { this.audio.derrota(); }
        this.transicionarA('duelo-resultado');
      }
      return;
    }

    if (res.estado_partida === 'en_curso' && this.fase() === 'duelo-esperando') {
      this.transicionarA('duelo-jugando');
    }

    if (res.pregunta_actual && res.pregunta_actual.id !== this.dueloPreguntaIdCargada) {
      this.dueloPreguntaIdCargada = res.pregunta_actual.id;
      this.dueloOpcionSeleccionada.set(null);
      this.dueloFeedback.set(null);
      this.dueloRespondiendo.set(false);
      this.iniciarTemporizadorDuelo(res.pregunta_actual.tiempo_limite_segundos);
    } else if (! res.pregunta_actual) {
      this.limpiarTemporizadorDuelo();
    }
  }

  private iniciarPollingDuelo(partidaId: number): void {
    this.detenerPollingDuelo();
    this.dueloPollId = setInterval(() => {
      if (this.dueloRespondiendo() || this.dueloPollEnCurso) return;

      this.dueloPollEnCurso = true;
      this.dueloService.estado(partidaId).subscribe({
        next: (res) => { this.dueloPollEnCurso = false; this.aplicarEstadoDuelo(res); },
        error: () => { this.dueloPollEnCurso = false; },
      });
    }, 2500);
  }

  private detenerPollingDuelo(): void {
    if (this.dueloPollId !== null) {
      clearInterval(this.dueloPollId);
      this.dueloPollId = null;
    }
    this.dueloPollEnCurso = false;
  }

  private iniciarTemporizadorDuelo(segundos: number): void {
    this.limpiarTemporizadorDuelo();
    this.dueloTiempoRestante.set(segundos);
    this.dueloTimerId = setInterval(() => {
      const actual = this.dueloTiempoRestante();
      if (actual <= 1) {
        this.limpiarTemporizadorDuelo();
        this.dueloTiempoRestante.set(0);
        this.responderDuelo(null);
        return;
      }
      const restante = actual - 1;
      this.dueloTiempoRestante.set(restante);
      if (restante > 0 && restante <= 5) this.audio.tick();
    }, 1000);
  }

  private limpiarTemporizadorDuelo(): void {
    if (this.dueloTimerId !== null) {
      clearInterval(this.dueloTimerId);
      this.dueloTimerId = null;
    }
  }
}
