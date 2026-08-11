import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CifraInstitucionalService } from '../../../../cifras-institucionales/application/services/cifra-institucional.service';
import { CifraInstitucional } from '../../../../cifras-institucionales/domain/models/cifra-institucional.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .st-section {
      background: #fff;
      position: relative;
      padding: 72px 0;
      overflow: hidden;
    }

    .st-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: #FC8900;
      border-radius: 0 0 4px 4px;
    }

    .st-section::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 15% 50%, rgba(18,138,162,0.035) 0%, transparent 45%),
        radial-gradient(circle at 85% 50%, rgba(252,137,0,0.035) 0%, transparent 45%);
      pointer-events: none;
    }

    .st-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      position: relative;
      z-index: 1;
    }

    .st-header {
      text-align: center;
      margin-bottom: 56px;
    }
    .st-badge {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(18,138,162,0.08);
      color: #128AA2;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.4px;
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(18,138,162,0.15);
      margin-bottom: 16px;
    }
    .st-badge i { color: #FC8900; }
    .st-title {
      font-size: clamp(26px, 3.5vw, 38px);
      font-weight: 800;
      color: #128AA2;
      line-height: 1.2;
      margin-bottom: 14px;
    }
    .st-title span { color: #FC8900; }
    .st-subtitle {
      font-size: 15px;
      color: #666;
      line-height: 1.7;
      max-width: 520px;
      margin: 0 auto;
    }

    .st-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .st-card {
      position: relative;
      background: #fff;
      border-radius: 20px;
      padding: 36px 28px 32px;
      text-align: center;
      border: 1.5px solid rgba(18,138,162,0.08);
      box-shadow: 0 4px 24px rgba(18,138,162,0.07);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      overflow: hidden;
    }
    .st-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #128AA2, #FC8900);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .st-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 48px rgba(18,138,162,0.13);
      border-color: rgba(18,138,162,0.15);
    }
    .st-card:hover::before {
      opacity: 1;
    }

    .st-card-bg-num {
      position: absolute;
      bottom: -16px;
      right: -8px;
      font-size: 96px;
      font-weight: 900;
      line-height: 1;
      color: rgba(18,138,162,0.04);
      user-select: none;
      pointer-events: none;
      letter-spacing: -4px;
    }

    .st-icon-wrap {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, rgba(18,138,162,0.10) 0%, rgba(18,138,162,0.06) 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 26px;
      color: #128AA2;
      transition: background 0.3s ease, transform 0.3s ease;
    }
    .st-card:hover .st-icon-wrap {
      background: linear-gradient(135deg, #128AA2 0%, #0a5573 100%);
      color: #fff;
      transform: scale(1.08) rotate(-5deg);
    }

    .st-valor {
      font-size: clamp(36px, 4vw, 48px);
      font-weight: 900;
      color: #128AA2;
      line-height: 1;
      margin-bottom: 8px;
      letter-spacing: -1px;
    }
    .st-valor-accent {
      color: #FC8900;
    }

    .st-divider {
      width: 32px;
      height: 3px;
      background: #FC8900;
      border-radius: 2px;
      margin: 10px auto 12px;
      transition: width 0.3s ease;
    }
    .st-card:hover .st-divider {
      width: 48px;
    }

    .st-etiqueta {
      font-size: 13px;
      font-weight: 700;
      color: #128AA2;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .st-desc {
      font-size: 13px;
      color: #9ca3af;
      line-height: 1.5;
    }

    .st-skeleton {
      background: #fff;
      border-radius: 20px;
      padding: 36px 28px 32px;
      border: 1.5px solid rgba(18,138,162,0.06);
      box-shadow: 0 4px 24px rgba(18,138,162,0.05);
    }
    .st-skel-block {
      background: #f1f5f8;
      border-radius: 8px;
      animation: stPulse 1.5s ease-in-out infinite;
    }
    .st-skel-icon  { width: 64px; height: 64px; border-radius: 18px; margin: 0 auto 20px; }
    .st-skel-num   { width: 90px; height: 48px; margin: 0 auto 12px; border-radius: 10px; }
    .st-skel-line1 { width: 70%;  height: 10px; margin: 0 auto 8px; }
    .st-skel-line2 { width: 50%;  height: 10px; margin: 0 auto; }
    @keyframes stPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.45; }
    }

    @media (max-width: 1024px) {
      .st-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
    }
    @media (max-width: 576px) {
      .st-section { padding: 56px 0; }
      .st-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
      .st-card { padding: 28px 18px 24px; }
      .st-icon-wrap { width: 52px; height: 52px; font-size: 22px; border-radius: 14px; }
      .st-valor { font-size: 34px; }
    }
    @media (max-width: 380px) {
      .st-grid { grid-template-columns: 1fr; }
    }
  `],
  template: `
    <section class="st-section">
      <div class="st-container">

        <div class="st-header">
          <div class="st-badge">
            <i class="fa-solid fa-chart-line"></i>
            Nuestros números
          </div>
          <h2 class="st-title">
            Resultados que <span>hablan por sí solos</span>
          </h2>
          <p class="st-subtitle">
            Más de una década formando profesionales en Bolivia con programas de alta calidad y docentes especializados.
          </p>
        </div>

        <div class="st-grid">

          @if (cargando()) {
            @for (_ of [1,2,3,4]; track $index) {
              <div class="st-skeleton">
                <div class="st-skel-block st-skel-icon"></div>
                <div class="st-skel-block st-skel-num"></div>
                <div class="st-skel-block st-skel-line1"></div>
                <div class="st-skel-block st-skel-line2" style="margin-top:8px"></div>
              </div>
            }
          } @else {
            @for (cifra of cifras(); track cifra.id; let i = $index) {
              <div class="st-card">
                
                <span class="st-card-bg-num">{{ i + 1 }}</span>

                @if (cifra.icono) {
                  <div class="st-icon-wrap">
                    <i [class]="cifra.icono"></i>
                  </div>
                }

                <div class="st-valor">{{ formatValor(cifra.valor).prefix }}<span class="st-valor-accent">{{ formatValor(cifra.valor).num }}</span>{{ formatValor(cifra.valor).suffix }}</div>

                <div class="st-divider"></div>

                <div class="st-etiqueta">{{ cifra.etiqueta }}</div>

                @if (cifra.descripcion) {
                  <div class="st-desc">{{ cifra.descripcion }}</div>
                }
              </div>
            }
          }

        </div>
      </div>
    </section>
  `,
})
export class StatsComponent implements OnInit {
  private service = inject(CifraInstitucionalService);
  private cdr     = inject(ChangeDetectorRef);

  cifras   = signal<CifraInstitucional[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: data => {
        this.cifras.set(data);
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  formatValor(valor: string): { prefix: string; num: string; suffix: string } {
    const match = valor.match(/^([^\d]*)(\d[\d,.]*)([^\d]*)$/);
    if (!match) return { prefix: '', num: valor, suffix: '' };
    return { prefix: match[1], num: match[2], suffix: match[3] };
  }
}
