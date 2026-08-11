import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionService } from '../../../../configuracion/application/services/configuracion.service';
import { ConfiguracionPublica } from '../../../../configuracion/domain/models/configuracion.model';

@Component({
  selector: 'app-mision-vision',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .mv-section {
      background: var(--ztc-bg-bg-1, #f4f8f9);
      padding: 100px 0;
      position: relative;
      overflow: hidden;
    }

    .mv-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .mv-header {
      text-align: center;
      margin-bottom: 56px;
    }
    .mv-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(18,138,162,0.08);
      color: #128AA2;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 7px 18px;
      border-radius: 20px;
      border: 1px solid rgba(18,138,162,0.16);
      margin-bottom: 20px;
    }
    .mv-badge i { color: #FC8900; }
    .mv-title {
      font-size: clamp(28px, 3.5vw, 40px);
      font-weight: 800;
      color: #0a2433;
      line-height: 1.2;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
    }
    .mv-title span { color: #128AA2; }
    .mv-subtitle {
      font-size: 15px;
      color: #6b7280;
      line-height: 1.7;
      max-width: 540px;
      margin: 0 auto;
    }

    .mv-skel-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      border: 1px solid #dce8ec;
      overflow: hidden;
    }
    .mv-skel-panel {
      background: #fff;
      padding: 52px 48px;
    }
    .mv-skel-block {
      background: rgba(18,138,162,0.08);
      border-radius: 8px;
      animation: mvPulse 1.5s ease-in-out infinite;
    }
    .mv-skel-tag { width: 90px; height: 14px; margin-bottom: 22px; }
    .mv-skel-line { height: 14px; margin-bottom: 10px; }
    @keyframes mvPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    .mv-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      border: 1px solid #dce8ec;
      overflow: hidden;
      border-radius: 20px;
    }
    .mv-panel {
      background: #fff;
      padding: 52px 48px;
      position: relative;
      overflow: hidden;
    }
    .mv-glow {
      position: absolute;
      bottom: -40px; right: -40px;
      width: 180px; height: 180px;
      border-radius: 50%;
      pointer-events: none;
    }
    .mv-panel--teal .mv-glow   { background: radial-gradient(circle, rgba(18,138,162,0.10) 0%, transparent 70%); }
    .mv-panel--orange .mv-glow { background: radial-gradient(circle, rgba(252,137,0,0.10) 0%, transparent 70%); }
    .mv-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      margin-bottom: 22px;
    }
    .mv-tag--teal   { color: #128AA2; }
    .mv-tag--orange { color: #FC8900; }
    .mv-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .mv-tag--teal   .mv-dot { background: #128AA2; }
    .mv-tag--orange .mv-dot { background: #FC8900; }
    .mv-panel-title {
      font-size: clamp(20px, 2.2vw, 28px);
      font-weight: 800;
      color: #0a2433;
      line-height: 1.1;
      margin-bottom: 16px;
      letter-spacing: -0.3px;
    }
    .mv-panel-text {
      font-size: 15px;
      line-height: 1.82;
      color: #6b7280;
    }

    /* ── Tablet ── */
    @media (max-width: 900px) {
      .mv-section { padding: 72px 0; }
      .mv-header { margin-bottom: 44px; }
      .mv-split, .mv-skel-split { grid-template-columns: 1fr; }
      .mv-panel, .mv-skel-panel { padding: 40px 28px; }
    }

    /* ── Móvil ── */
    @media (max-width: 576px) {
      .mv-container { padding: 0 20px; }
      .mv-section { padding: 56px 0; }
      .mv-header { margin-bottom: 36px; }
      .mv-split, .mv-skel-split { border-radius: 16px; }
      .mv-panel, .mv-skel-panel { padding: 32px 20px; }
    }
  `],
  template: `
    <section class="mv-section">
      <div class="mv-container">

        <div class="mv-header">
          <div class="mv-badge">
            <i class="fa-solid fa-compass"></i>
            Propósito institucional
          </div>
          <h2 class="mv-title">
            Nuestra <span>misión y visión</span>
          </h2>
          <p class="mv-subtitle">
            Los principios que guían cada programa y cada decisión de CENEFCO, hoy y hacia el futuro.
          </p>
        </div>

        @if (cargando()) {
          <div class="mv-skel-split">
            <div class="mv-skel-panel">
              <div class="mv-skel-block mv-skel-tag"></div>
              <div class="mv-skel-block mv-skel-line" style="width:60%; height:22px; margin-bottom:16px"></div>
              <div class="mv-skel-block mv-skel-line" style="width:100%"></div>
              <div class="mv-skel-block mv-skel-line" style="width:92%"></div>
              <div class="mv-skel-block mv-skel-line" style="width:70%"></div>
            </div>
            <div class="mv-skel-panel">
              <div class="mv-skel-block mv-skel-tag"></div>
              <div class="mv-skel-block mv-skel-line" style="width:60%; height:22px; margin-bottom:16px"></div>
              <div class="mv-skel-block mv-skel-line" style="width:100%"></div>
              <div class="mv-skel-block mv-skel-line" style="width:92%"></div>
              <div class="mv-skel-block mv-skel-line" style="width:70%"></div>
            </div>
          </div>
        } @else if (config()?.mision || config()?.vision) {
          <div class="mv-split">
            @if (config()?.mision) {
              <div class="mv-panel mv-panel--teal">
                <div class="mv-glow"></div>
                <div class="mv-tag mv-tag--teal">
                  <span class="mv-dot"></span> Misión
                </div>
                <h3 class="mv-panel-title">Lo que hacemos hoy</h3>
                <p class="mv-panel-text">{{ config()!.mision }}</p>
              </div>
            }
            @if (config()?.vision) {
              <div class="mv-panel mv-panel--orange">
                <div class="mv-glow"></div>
                <div class="mv-tag mv-tag--orange">
                  <span class="mv-dot"></span> Visión
                </div>
                <h3 class="mv-panel-title">Lo que construimos mañana</h3>
                <p class="mv-panel-text">{{ config()!.vision }}</p>
              </div>
            }
          </div>
        }

      </div>
    </section>
  `,
})
export class MisionVisionComponent implements OnInit {
  private configService = inject(ConfiguracionService);
  private cdr            = inject(ChangeDetectorRef);

  config   = signal<ConfiguracionPublica | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    this.configService.getPublicaWeb().subscribe({
      next: (res) => {
        this.config.set(res.data);
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
    });
  }
}
