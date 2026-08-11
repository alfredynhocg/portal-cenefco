import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoridadService } from '../../../../autoridades/application/services/autoridad.service';
import { Autoridad } from '../../../../autoridades/domain/models/autoridad.model';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-equipo-directivo',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .eq-section {
      background: #0a2433;
      position: relative;
      padding: 100px 0;
      overflow: hidden;
    }

    .eq-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 12% 20%, rgba(62,205,232,0.10) 0%, transparent 45%),
        radial-gradient(circle at 92% 85%, rgba(252,137,0,0.10) 0%, transparent 45%);
      pointer-events: none;
    }

    .eq-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .eq-header {
      text-align: center;
      margin-bottom: 64px;
    }
    .eq-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(255,255,255,0.06);
      color: #3ecde8;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 7px 18px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.12);
      margin-bottom: 20px;
    }
    .eq-badge i { color: #FC8900; }
    .eq-title {
      font-size: clamp(28px, 3.5vw, 40px);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
    }
    .eq-title span { color: #3ecde8; }
    .eq-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
      max-width: 540px;
      margin: 0 auto;
    }

    /* ── Panel principal: foto + perfil ── */
    .eq-perfil {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 0;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 28px;
      overflow: hidden;
      position: relative;
    }
    .eq-perfil--solo {
      grid-template-columns: 1fr;
      max-width: 480px;
      margin: 0 auto;
    }

    /* Columna foto */
    .eq-foto-col {
      position: relative;
      background: linear-gradient(160deg, #103349 0%, #0a2433 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      min-height: 460px;
      overflow: hidden;
    }
    .eq-foto-col::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 220px; height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(252,137,0,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .eq-foto-col img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      position: absolute;
      inset: 0;
    }
    .eq-foto-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      inset: 0;
    }
    .eq-foto-placeholder i {
      font-size: 96px;
      color: rgba(255,255,255,0.12);
    }
    .eq-foto-fade {
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(10,36,51,0.92) 0%, rgba(10,36,51,0) 42%);
      z-index: 1;
    }
    .eq-foto-caption {
      position: relative;
      z-index: 2;
      padding: 28px 32px;
      width: 100%;
    }
    .eq-foto-nombre {
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      line-height: 1.25;
      margin-bottom: 8px;
      letter-spacing: -0.3px;
    }
    .eq-foto-cargo {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #0a2433;
      background: #FC8900;
      padding: 6px 14px;
      border-radius: 20px;
    }

    /* Columna descripción */
    .eq-perfil-desc {
      padding: 56px 56px 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }
    .eq-quote-mark {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 96px;
      line-height: 1;
      color: #FC8900;
      opacity: 0.25;
      height: 48px;
      margin-bottom: 8px;
      user-select: none;
    }
    .eq-perfil-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #3ecde8;
      margin-bottom: 18px;
    }
    .eq-perfil-texto {
      font-size: 18px;
      line-height: 1.9;
      color: rgba(255,255,255,0.85);
      font-weight: 400;
    }
    .eq-perfil-rule {
      width: 56px;
      height: 3px;
      background: linear-gradient(90deg, #3ecde8, #FC8900);
      border-radius: 2px;
      margin-top: 32px;
    }

    .eq-skeleton-perfil {
      grid-template-columns: 380px 1fr;
    }
    .eq-skel-foto-col {
      min-height: 460px;
      background: rgba(255,255,255,0.04);
    }
    .eq-skel-desc-col {
      padding: 56px;
    }
    .eq-skel-block {
      background: rgba(255,255,255,0.06);
      border-radius: 8px;
      animation: eqPulse 1.5s ease-in-out infinite;
    }
    .eq-skel-line  { height: 16px; border-radius: 6px; margin-bottom: 14px; }
    @keyframes eqPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    /* ── Tablet grande / laptop pequeña: columnas más angostas ── */
    @media (max-width: 1100px) {
      .eq-perfil, .eq-skeleton-perfil { grid-template-columns: 300px 1fr; }
      .eq-foto-col, .eq-skel-foto-col { min-height: 420px; }
      .eq-perfil-desc, .eq-skel-desc-col { padding: 44px 40px; }
    }

    /* ── Tablet: apila foto arriba, texto abajo ── */
    @media (max-width: 900px) {
      .eq-container { padding: 0 20px; }
      .eq-header { margin-bottom: 44px; }
      .eq-perfil, .eq-skeleton-perfil { grid-template-columns: 1fr; border-radius: 24px; }
      .eq-foto-col, .eq-skel-foto-col { min-height: 400px; }
      .eq-perfil-desc, .eq-skel-desc-col { padding: 40px 32px 44px; align-items: center; text-align: center; }
      .eq-quote-mark { text-align: center; }
      .eq-perfil-rule { margin-left: auto; margin-right: auto; }
    }

    /* ── Móvil ── */
    @media (max-width: 576px) {
      .eq-section { padding: 56px 0; }
      .eq-header { margin-bottom: 36px; }
      .eq-perfil, .eq-skeleton-perfil { border-radius: 20px; }
      .eq-foto-col, .eq-skel-foto-col { min-height: 300px; }
      .eq-foto-col::before { width: 160px; height: 160px; top: -40px; right: -40px; }
      .eq-foto-caption { padding: 22px 20px; }
      .eq-foto-nombre { font-size: 18px; margin-bottom: 6px; }
      .eq-foto-cargo { font-size: 11px; padding: 5px 12px; }
      .eq-perfil-desc, .eq-skel-desc-col { padding: 28px 20px 32px; }
      .eq-quote-mark { font-size: 72px; height: 38px; }
      .eq-perfil-label { font-size: 10px; letter-spacing: 2px; margin-bottom: 14px; }
      .eq-perfil-texto { font-size: 15.5px; line-height: 1.8; }
      .eq-perfil-rule { margin-top: 24px; }
    }

    /* ── Móvil muy angosto ── */
    @media (max-width: 380px) {
      .eq-badge { font-size: 11px; padding: 6px 14px; letter-spacing: 1.5px; }
      .eq-foto-col, .eq-skel-foto-col { min-height: 260px; }
      .eq-foto-nombre { font-size: 16px; }
      .eq-perfil-desc, .eq-skel-desc-col { padding: 24px 16px 28px; }
      .eq-perfil-texto { font-size: 14.5px; }
    }
  `],
  template: `
    <section class="eq-section">
      <div class="eq-container">

        <div class="eq-header">
          <div class="eq-badge">
            <i class="fa-solid fa-user-tie"></i>
            Dirección General
          </div>
          <h2 class="eq-title">
            La autoridad que <span>lidera nuestra institución</span>
          </h2>
          <p class="eq-subtitle">
            Compromiso, visión y experiencia al frente del desarrollo académico y profesional de CENEFCO.
          </p>
        </div>

        @if (cargando()) {
          <div class="eq-perfil eq-skeleton-perfil">
            <div class="eq-skel-foto-col"></div>
            <div class="eq-skel-desc-col">
              <div class="eq-skel-block eq-skel-line" style="width:30%"></div>
              <div class="eq-skel-block eq-skel-line" style="width:100%; margin-top:24px"></div>
              <div class="eq-skel-block eq-skel-line" style="width:95%"></div>
              <div class="eq-skel-block eq-skel-line" style="width:88%"></div>
              <div class="eq-skel-block eq-skel-line" style="width:60%"></div>
            </div>
          </div>
        } @else {
          @for (autoridad of autoridades(); track autoridad.id) {
            <div class="eq-perfil" [class.eq-perfil--solo]="!autoridad.perfil_profesional">

              <div class="eq-foto-col">
                @if (autoridad.foto_url) {
                  <img [src]="autoridad.foto_url | imageUrl" [alt]="autoridad.nombre + ' ' + autoridad.apellido">
                } @else {
                  <div class="eq-foto-placeholder">
                    <i class="fa-solid fa-user"></i>
                  </div>
                }
                <div class="eq-foto-fade"></div>
                <div class="eq-foto-caption">
                  <div class="eq-foto-nombre">{{ autoridad.nombre }} {{ autoridad.apellido }}</div>
                  <span class="eq-foto-cargo">{{ autoridad.cargo }}</span>
                </div>
              </div>

              @if (autoridad.perfil_profesional) {
                <div class="eq-perfil-desc">
                  <div class="eq-quote-mark">&ldquo;</div>
                  <div class="eq-perfil-label">Perfil profesional</div>
                  <p class="eq-perfil-texto">{{ autoridad.perfil_profesional }}</p>
                  <div class="eq-perfil-rule"></div>
                </div>
              }

            </div>
          }
        }

      </div>
    </section>
  `,
})
export class EquipoDirectivoComponent implements OnInit {
  private service = inject(AutoridadService);
  private cdr     = inject(ChangeDetectorRef);

  autoridades = signal<Autoridad[]>([]);
  cargando    = signal(true);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: res => {
        this.autoridades.set(res.data);
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
