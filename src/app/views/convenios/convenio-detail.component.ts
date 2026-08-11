import { Component, inject, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ConvenioService, ConvenioDetalle } from '../../convenios/convenio.service';

@Component({
  selector: 'app-convenio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent],
  templateUrl: './convenio-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .cvd-hero {
      position: relative; min-height: 220px;
      display: flex; align-items: flex-end; overflow: hidden;
      background: #128AA2;
    }
    .cvd-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(18,138,162,0.4) 0%, rgba(18,138,162,0.93) 100%);
    }
    .cvd-hero-pattern {
      position: absolute; inset: 0; opacity: .06;
      background-image: radial-gradient(circle, #fff 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .cvd-hero-body {
      position: relative; z-index: 1; padding: 44px 0 36px; width: 100%;
    }
    .cvd-hero-title {
      font-size: clamp(22px, 3.4vw, 36px); font-weight: 800; color: #fff; margin: 14px 0 0;
    }

    .cvd-section { background: #f4f7f9; padding: 56px 0 90px; }

    .cvd-card {
      background: #fff; border-radius: 20px; overflow: hidden;
      border: 1.5px solid rgba(18,138,162,0.08);
      box-shadow: 0 4px 24px rgba(18,138,162,0.08);
    }
    .cvd-card-top {
      display: flex; align-items: center; gap: 28px;
      padding: 36px; border-bottom: 1px solid rgba(18,138,162,0.08);
      flex-wrap: wrap;
    }
    .cvd-logo-wrap {
      width: 140px; height: 140px; flex: 0 0 auto;
      display: flex; align-items: center; justify-content: center;
      background: #fafbfc; border-radius: 16px; padding: 16px;
      border: 1px solid rgba(18,138,162,0.06);
    }
    .cvd-logo-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .cvd-logo-placeholder {
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(18,138,162,0.06); display: flex; align-items: center; justify-content: center;
    }
    .cvd-logo-placeholder i { font-size: 30px; color: rgba(18,138,162,0.3); }

    .cvd-name { font-size: 22px; font-weight: 800; color: #128AA2; margin-bottom: 6px; }
    .cvd-inst { font-size: 14.5px; color: #666; }
    .cvd-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(252,137,0,0.1); color: #FC8900;
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
      padding: 5px 14px; border-radius: 20px; margin-top: 10px;
    }

    .cvd-card-body { padding: 32px 36px; }
    .cvd-descripcion { font-size: 15px; color: #444; line-height: 1.7; }

    .cvd-doc-btn {
      display: inline-flex; align-items: center; gap: 8px; margin-top: 28px;
      background: #128AA2; color: #fff; padding: 12px 26px;
      border-radius: 10px; font-weight: 700; font-size: 14px;
      text-decoration: none; transition: background .2s;
    }
    .cvd-doc-btn:hover { background: #0e6f83; color: #fff; }

    .cvd-back {
      display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px;
      color: #128AA2; font-weight: 700; font-size: 14px; text-decoration: none;
    }
    .cvd-back:hover { color: #0e6f83; }

    .cvd-skel-top { height: 190px; background: #eef0f2; animation: cvd-sk 1.4s ease-in-out infinite; }
    .cvd-skel-line { height: 13px; border-radius: 6px; background: #eef0f2; margin-top: 14px; animation: cvd-sk 1.4s ease-in-out infinite; }
    @keyframes cvd-sk { 0%,100%{opacity:1} 50%{opacity:.45} }

    .cvd-empty {
      text-align: center; padding: 80px 20px;
      background: #fff; border-radius: 20px;
      border: 1.5px dashed rgba(18,138,162,0.15);
    }
    .cvd-empty i { font-size: 48px; color: rgba(18,138,162,0.2); margin-bottom: 16px; }
    .cvd-empty p { color: #999; font-size: 15px; }

    @media (max-width: 575px) {
      .cvd-card-top { padding: 24px; gap: 18px; }
      .cvd-card-body { padding: 24px; }
      .cvd-logo-wrap { width: 100px; height: 100px; }
    }
  `]
})
export class ConvenioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ConvenioService);
  private cdr = inject(ChangeDetectorRef);

  convenio: ConvenioDetalle | null = null;
  cargando = true;
  noEncontrado = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.cargando = false;
      this.noEncontrado = true;
      return;
    }

    this.service.getById(id).subscribe({
      next: (data) => {
        this.convenio = { ...data, logo_url: data.logo_url ? `/storage/${data.logo_url}` : null };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.noEncontrado = true;
        this.cdr.detectChanges();
      }
    });
  }
}
