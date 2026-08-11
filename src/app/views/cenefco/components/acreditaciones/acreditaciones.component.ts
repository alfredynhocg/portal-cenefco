import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcreditacionService } from '../../../../acreditaciones/application/services/acreditacion.service';
import { Acreditacion } from '../../../../acreditaciones/domain/models/acreditacion.model';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { AcreditacionModalComponent } from '../../../../components/acreditacion-modal/acreditacion-modal.component';

@Component({
  selector: 'app-acreditaciones',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe, AcreditacionModalComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [`

    .ac-section {
      background: var(--ztc-bg-bg-1, #f4f8f9);
      padding: 104px 0;
      position: relative;
      overflow: hidden;
    }

    .ac-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 56px;
    }

    .ac-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .ac-card {
      background: #fff;
      border: 1px solid var(--ztc-border-border-1, #e5edf0);
      border-radius: 16px;
      padding: 28px 20px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }
    .ac-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #128AA2, #FC8900);
      opacity: 0;
      transition: opacity .25s ease;
    }
    .ac-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 40px rgba(18,138,162,0.12);
      border-color: var(--ztc-bg-bg-4, #128AA2);
    }
    .ac-card:hover::before { opacity: 1; }

    .ac-logo-wrap {
      width: 84px; height: 84px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .ac-logo-wrap img {
      max-width: 100%; max-height: 100%;
      object-fit: contain;
    }
    .ac-logo-fallback {
      width: 84px; height: 84px;
      border-radius: 50%;
      background: rgba(18,138,162,0.08);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px;
    }
    .ac-logo-fallback i { font-size: 30px; color: #128AA2; }

    .ac-card-nombre {
      font-family: var(--ztc-family-ff-heading);
      font-size: 15px; font-weight: 800;
      color: #0a2433; line-height: 1.3;
      margin-bottom: 5px;
    }
    .ac-card-entidad {
      font-family: var(--ztc-family-ff-body);
      font-size: 12.5px; color: var(--ztc-text-text-4, #6b7280);
      line-height: 1.5;
      margin-bottom: 10px;
    }
    .ac-card-tipo {
      display: inline-flex;
      font-size: 10px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: var(--ztc-bg-bg-3, #FC8900);
      background: rgba(252,137,0,0.08);
      padding: 3px 10px; border-radius: 20px;
    }

    .ac-skel { opacity: 0.6; }
    .ac-skel-block {
      background: rgba(18,138,162,0.08);
      border-radius: 8px;
      animation: acPulse 1.5s ease-in-out infinite;
    }
    @keyframes acPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

    @media (max-width: 991px) {
      .ac-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 767px) {
      .ac-section { padding: 64px 0; }
      .ac-header { margin-bottom: 36px; }
      .ac-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
      .ac-card { padding: 22px 14px 18px; }
      .ac-logo-wrap, .ac-logo-fallback { width: 64px; height: 64px; }
    }
  `],
  template: `
    <section class="ac-section">
      <div class="container">

        <div class="ac-header">
          <p class="cn-section-label">Respaldo institucional</p>
          <h2 class="cn-qs-title" style="text-align:center">Nuestras <span style="color:var(--ztc-bg-bg-3,#FC8900)">Acreditaciones</span></h2>
          <p style="font-family:var(--ztc-family-ff-body);font-size:15px;line-height:1.7;color:var(--ztc-text-text-4,#6b7280);margin-top:14px">
            Reconocimientos y certificaciones que avalan la calidad de nuestros programas.
          </p>
        </div>

        @if (cargando()) {
          <div class="ac-grid ac-skel">
            @for (i of [1,2,3,4]; track i) {
              <div class="ac-card">
                <div class="ac-skel-block" style="width:84px;height:84px;border-radius:50%;margin-bottom:16px"></div>
                <div class="ac-skel-block" style="width:80%;height:14px;margin-bottom:8px"></div>
                <div class="ac-skel-block" style="width:60%;height:12px"></div>
              </div>
            }
          </div>
        } @else if (acreditaciones().length > 0) {
          <div class="ac-grid">
            @for (a of acreditaciones(); track a.id) {
              <div class="ac-card" (click)="abrirDetalle(a)" role="button" tabindex="0" (keyup.enter)="abrirDetalle(a)">
                @if (a.logo_url) {
                  <div class="ac-logo-wrap">
                    <img [src]="a.logo_url | imageUrl" [alt]="a.logo_alt || a.nombre" loading="lazy">
                  </div>
                } @else {
                  <div class="ac-logo-fallback">
                    <i class="fa-solid fa-award"></i>
                  </div>
                }
                <h3 class="ac-card-nombre">{{ a.nombre }}</h3>
                <p class="ac-card-entidad">{{ a.entidad_otorgante }}</p>
                @if (a.tipo) {
                  <span class="ac-card-tipo">{{ a.tipo }}</span>
                }
              </div>
            }
          </div>
        }

      </div>
    </section>

    <app-acreditacion-modal
      [visible]="modalVisible()"
      [acreditacion]="acreditacionSeleccionada()"
      (visibleChange)="modalVisible.set($event)">
    </app-acreditacion-modal>
  `,
})
export class AcreditacionesComponent implements OnInit {
  private service = inject(AcreditacionService);
  private cdr = inject(ChangeDetectorRef);

  acreditaciones = signal<Acreditacion[]>([]);
  cargando = signal(true);

  modalVisible = signal(false);
  acreditacionSeleccionada = signal<Acreditacion | null>(null);

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (res) => {
        this.acreditaciones.set(res.data);
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  abrirDetalle(a: Acreditacion): void {
    this.acreditacionSeleccionada.set(a);
    this.modalVisible.set(true);
  }
}
