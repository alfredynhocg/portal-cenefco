import { Component, OnInit, ViewEncapsulation, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { TriviaService } from '../../../../trivia/application/services/trivia.service';
import { TriviaCategoria, TriviaPremio, TriviaRankingItem } from '../../../../trivia/domain/models/trivia.model';

const RUEDA_COLORES = ['#FC8900', '#facc15', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'];

@Component({
  selector: 'app-trivia-banner',
  standalone: true,
  imports: [RouterLink, ImageUrlPipe],
  templateUrl: './trivia-banner.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .tb-section {
      background: linear-gradient(135deg, #0d5f72 0%, #128AA2 55%, #0e6f85 100%);
      padding: 88px 0;
      position: relative;
      overflow: hidden;
    }

    .tb-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .tb-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      gap: 48px;
    }

    .tb-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 7px 18px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.18);
      margin-bottom: 20px;
    }
    .tb-badge i { color: #FC8900; }

    .tb-title {
      font-size: clamp(28px, 3.5vw, 40px);
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
      margin-bottom: 16px;
      letter-spacing: -0.5px;
    }
    .tb-title span {
      background: linear-gradient(90deg, #FC8900, #facc15);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .tb-text {
      font-size: 15px;
      color: rgba(255,255,255,0.82);
      line-height: 1.8;
      max-width: 480px;
      margin-bottom: 28px;
    }

    .tb-features {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }
    .tb-feature {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.16);
      color: #fff;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 20px;
    }
    .tb-feature i { color: #FC8900; font-size: 12px; }

    .tb-top-jugador {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 14px;
      padding: 10px 16px;
      margin-bottom: 26px;
    }
    .tb-top-jugador__avatar {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #FC8900;
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      text-transform: uppercase;
    }
    .tb-top-jugador__avatar img { width: 100%; height: 100%; object-fit: cover; }
    .tb-top-jugador__texto {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
    }
    .tb-top-jugador__texto i { color: #facc15; margin-right: 4px; }
    .tb-top-jugador__texto strong { color: #fff; }

    .tb-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #FC8900;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      padding: 15px 32px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 10px 26px rgba(252,137,0,0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .tb-cta:hover {
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(252,137,0,0.45);
    }

    .tb-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .tb-wheel {
      position: relative;
      width: min(300px, 70vw);
      height: min(300px, 70vw);
      border-radius: 50%;
      background: conic-gradient(#FC8900 0deg 60deg, #facc15 60deg 120deg, #34d399 120deg 180deg, #60a5fa 180deg 240deg, #f472b6 240deg 300deg, #a78bfa 300deg 360deg);
      border: 6px solid #fff;
      box-shadow: 0 24px 60px rgba(0,0,0,0.28);
      animation: tbSpin 26s linear infinite;
    }

    @keyframes tbSpin {
      to { transform: rotate(360deg); }
    }

    .tb-wheel__etiqueta {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50%;
      height: 0;
      transform-origin: 0% 0%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 14px;
      pointer-events: none;

      span {
        display: inline-block;
        color: #fff;
        font-weight: 700;
        font-size: 0.68rem;
        text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        max-width: 80px;
        text-align: right;
        line-height: 1.2;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
    }

    .tb-wheel-center {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 88px; height: 88px;
      border-radius: 50%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.18);
      z-index: 2;
    }
    .tb-wheel-center img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }

    .tb-glow {
      position: absolute;
      inset: -30px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(252,137,0,0.18) 0%, transparent 70%);
      pointer-events: none;
      z-index: -1;
    }

    .tb-premios {
      margin-top: 56px;
      padding-top: 40px;
      border-top: 1px solid rgba(255,255,255,0.14);
    }
    .tb-premios__titulo {
      color: rgba(255,255,255,0.9);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
      text-align: center;
    }
    .tb-premios__titulo i { color: #FC8900; margin-right: 6px; }

    .tb-premios__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 16px;
      max-width: 780px;
      margin: 0 auto;
    }

    .tb-premio {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 14px;
      padding: 14px 16px;
    }
    .tb-premio__icono {
      flex-shrink: 0;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: #FC8900;
      font-size: 18px;
    }
    .tb-premio__icono img { width: 100%; height: 100%; object-fit: cover; }
    .tb-premio__info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .tb-premio__nombre {
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tb-premio__costo {
      color: #facc15;
      font-size: 12.5px;
      font-weight: 700;
    }

    /* ── Tablet ── */
    @media (max-width: 900px) {
      .tb-section { padding: 64px 0; }
      .tb-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
      .tb-text { margin-left: auto; margin-right: auto; }
      .tb-features { justify-content: center; }
      .tb-top-jugador { margin-left: auto; margin-right: auto; }
      .tb-visual { order: -1; }
    }

    /* ── Móvil ── */
    @media (max-width: 576px) {
      .tb-container { padding: 0 20px; }
      .tb-section { padding: 52px 0; }
    }
  `],
})
export class TriviaBannerComponent implements OnInit {
  private triviaService = inject(TriviaService);

  categorias = signal<TriviaCategoria[]>([]);
  premios    = signal<TriviaPremio[]>([]);
  ranking    = signal<TriviaRankingItem[]>([]);

  topJugador = computed(() => this.ranking()[0] ?? null);

  ngOnInit(): void {
    this.triviaService.getCategorias().subscribe({
      next: (res) => this.categorias.set(res.data.filter(c => c.activo).slice(0, 6)),
      error: () => {},
    });

    this.triviaService.getPremios().subscribe({
      next: (res) => this.premios.set(res.data.filter(p => p.activo).slice(0, 3)),
      error: () => {},
    });

    this.triviaService.getRanking(1).subscribe({
      next: (res) => this.ranking.set(res.data),
      error: () => {},
    });
  }

  private colorSector(i: number): string {
    return RUEDA_COLORES[i % RUEDA_COLORES.length];
  }

  gradienteRueda = computed(() => {
    const cats = this.categorias();
    if (!cats.length) {
      return 'conic-gradient(#FC8900 0deg 60deg, #facc15 60deg 120deg, #34d399 120deg 180deg, #60a5fa 180deg 240deg, #f472b6 240deg 300deg, #a78bfa 300deg 360deg)';
    }

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
}
