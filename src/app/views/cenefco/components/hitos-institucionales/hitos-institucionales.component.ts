import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HitoInstitucionalService } from '../../../../hitos-institucionales/application/services/hito-institucional.service';
import { HitoInstitucional } from '../../../../hitos-institucionales/domain/models/hito-institucional.model';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-hitos-institucionales',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .hi-section {
      background: var(--ztc-text-text-1, #fff);
      padding: 104px 0;
      position: relative;
      overflow: hidden;
    }

    .hi-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 64px;
    }

    .hi-timeline {
      position: relative;
      max-width: 900px;
      margin: 0 auto;
    }
    .hi-timeline::before {
      content: '';
      position: absolute;
      top: 0; bottom: 0; left: 50%;
      width: 2px;
      background: linear-gradient(180deg, transparent, rgba(18,138,162,0.20) 6%, rgba(18,138,162,0.20) 94%, transparent);
      transform: translateX(-50%);
    }

    .hi-item {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 56px 1fr;
      align-items: start;
      gap: 0 32px;
      margin-bottom: 48px;
    }
    .hi-item:last-child { margin-bottom: 0; }

    .hi-dot {
      grid-column: 2;
      width: 56px; height: 56px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #128AA2;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--ztc-family-ff-heading);
      font-weight: 800;
      font-size: 11px;
      color: #128AA2;
      position: relative;
      z-index: 1;
      box-shadow: 0 4px 14px rgba(18,138,162,0.18);
    }

    .hi-card {
      background: var(--ztc-bg-bg-1, #f4f8f9);
      border: 1px solid var(--ztc-border-border-1, #e5edf0);
      border-radius: 16px;
      overflow: hidden;
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
    }
    .hi-item:nth-child(odd)  .hi-card { grid-column: 1; }
    .hi-item:nth-child(even) .hi-card { grid-column: 3; }
    .hi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 40px rgba(18,138,162,0.12);
      border-color: var(--ztc-bg-bg-4, #128AA2);
    }

    .hi-card-img {
      width: 100%; height: 160px;
      object-fit: cover;
      display: block;
    }

    .hi-card-body { padding: 22px 24px; }
    .hi-card-anio {
      display: inline-flex;
      font-family: var(--ztc-family-ff-body);
      font-size: 11px; font-weight: 800; letter-spacing: 2px;
      text-transform: uppercase; color: var(--ztc-bg-bg-3, #FC8900);
      margin-bottom: 8px;
    }
    .hi-card-title {
      font-family: var(--ztc-family-ff-heading);
      font-size: 18px; font-weight: 800;
      color: #0a2433; line-height: 1.3;
      margin-bottom: 8px;
    }
    .hi-card-desc {
      font-family: var(--ztc-family-ff-body);
      font-size: 14px; line-height: 1.7;
      color: var(--ztc-text-text-4, #6b7280);
      margin: 0;
    }

    .hi-skel { opacity: 0.6; }
    .hi-skel-block {
      background: rgba(18,138,162,0.08);
      border-radius: 8px;
      animation: hiPulse 1.5s ease-in-out infinite;
    }
    @keyframes hiPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

    /* ── Tablet / móvil: una sola columna, todo a la derecha del eje ── */
    @media (max-width: 767px) {
      .hi-section { padding: 64px 0; }
      .hi-header { margin-bottom: 40px; }
      .hi-timeline::before { left: 27px; }
      .hi-item {
        grid-template-columns: 56px 1fr;
        gap: 0 18px;
        margin-bottom: 32px;
      }
      .hi-dot { grid-column: 1; width: 46px; height: 46px; font-size: 10px; }
      .hi-item:nth-child(odd) .hi-card,
      .hi-item:nth-child(even) .hi-card { grid-column: 2; }
      .hi-card-img { height: 140px; }
      .hi-card-body { padding: 18px 20px; }
    }
  `],
  template: `
    <section class="hi-section">
      <div class="container">

        <div class="hi-header">
          <p class="cn-section-label">Nuestra trayectoria</p>
          <h2 class="cn-qs-title" style="text-align:center">Hitos <span style="color:var(--ztc-bg-bg-3,#FC8900)">Institucionales</span></h2>
          <p style="font-family:var(--ztc-family-ff-body);font-size:15px;line-height:1.7;color:var(--ztc-text-text-4,#6b7280);margin-top:14px">
            Momentos clave que marcaron el crecimiento de CENEFCO a lo largo de los años.
          </p>
        </div>

        @if (cargando()) {
          <div class="hi-timeline hi-skel">
            @for (i of [1,2,3]; track i) {
              <div class="hi-item">
                <div class="hi-dot"></div>
                <div class="hi-card">
                  <div class="hi-skel-block" style="height:160px"></div>
                  <div class="hi-card-body">
                    <div class="hi-skel-block" style="width:40%;height:12px;margin-bottom:10px"></div>
                    <div class="hi-skel-block" style="width:80%;height:18px;margin-bottom:10px"></div>
                    <div class="hi-skel-block" style="width:100%;height:12px"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (hitos().length > 0) {
          <div class="hi-timeline">
            @for (hito of hitos(); track hito.id) {
              <div class="hi-item">
                <div class="hi-dot">{{ hito.anio }}</div>
                <div class="hi-card">
                  @if (hito.imagen_url) {
                    <img [src]="hito.imagen_url | imageUrl" [alt]="hito.imagen_alt || hito.titulo" class="hi-card-img" loading="lazy">
                  }
                  <div class="hi-card-body">
                    <span class="hi-card-anio">{{ hito.anio }}</span>
                    <h3 class="hi-card-title">{{ hito.titulo }}</h3>
                    @if (hito.descripcion) {
                      <p class="hi-card-desc">{{ hito.descripcion }}</p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }

      </div>
    </section>
  `,
})
export class HitosInstitucionalesComponent implements OnInit {
  private service = inject(HitoInstitucionalService);
  private cdr = inject(ChangeDetectorRef);

  hitos = signal<HitoInstitucional[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.hitos.set(res.data);
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
