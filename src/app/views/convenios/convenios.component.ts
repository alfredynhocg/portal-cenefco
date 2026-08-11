import { Component, inject, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ConvenioService, Convenio } from '../../convenios/convenio.service';

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [CommonModule, RouterLink, BreadcrumbComponent],
  templateUrl: './convenios.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    
    .cv-hero {
      position: relative; min-height: 280px;
      display: flex; align-items: flex-end; overflow: hidden;
      background: #128AA2;
    }
    .cv-hero-bg {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; object-position: center; opacity: .22;
    }
    .cv-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(18,138,162,0.4) 0%, rgba(18,138,162,0.93) 100%);
    }
    .cv-hero-pattern {
      position: absolute; inset: 0; opacity: .06;
      background-image: radial-gradient(circle, #fff 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .cv-hero-body {
      position: relative; z-index: 1; padding: 52px 0 40px; width: 100%; text-align: center;
    }
    .cv-hero-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(255,255,255,0.12); color: #fff;
      font-size: 12px; font-weight: 700; letter-spacing: .5px;
      padding: 5px 16px; border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
    }
    .cv-hero-badge i { color: #FC8900; }
    .cv-hero-title {
      font-size: clamp(26px, 4vw, 44px); font-weight: 800; color: #fff; margin-bottom: 10px;
    }
    .cv-hero-title span { color: #FC8900; }
    .cv-hero-sub { color: rgba(255,255,255,0.65); font-size: 15px; max-width: 560px; margin: 0 auto 16px; }

    .cv-section { background: #f4f7f9; padding: 64px 0 90px; }

    .cv-stat-bar {
      display: flex; align-items: center; justify-content: center; gap: 40px;
      background: #fff; border-radius: 16px; padding: 22px 32px; margin-bottom: 52px;
      box-shadow: 0 2px 18px rgba(18,138,162,0.07); border: 1px solid rgba(18,138,162,0.07);
      flex-wrap: wrap;
    }
    .cv-stat-item { text-align: center; }
    .cv-stat-num { display: block; font-size: 28px; font-weight: 800; color: #128AA2; line-height: 1; }
    .cv-stat-lbl { font-size: 12px; color: #888; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: .5px; }

    .cv-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 24px;
    }

    .cv-card {
      background: #fff; border-radius: 16px; overflow: hidden;
      border: 1.5px solid rgba(18,138,162,0.08);
      box-shadow: 0 2px 12px rgba(18,138,162,0.06);
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      animation: cv-pulse 3.5s ease-in-out infinite;
      display: flex; flex-direction: column;
      cursor: pointer; text-decoration: none;
    }
    .cv-card:nth-child(2)  { animation-delay: .3s; }
    .cv-card:nth-child(3)  { animation-delay: .6s; }
    .cv-card:nth-child(4)  { animation-delay: .9s; }
    .cv-card:nth-child(5)  { animation-delay: 1.2s; }
    .cv-card:nth-child(6)  { animation-delay: 1.5s; }
    .cv-card:nth-child(7)  { animation-delay: 1.8s; }
    .cv-card:nth-child(8)  { animation-delay: 2.1s; }
    .cv-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 10px 32px rgba(18,138,162,0.15);
      border-color: rgba(18,138,162,0.2);
      animation-play-state: paused;
    }
    @keyframes cv-pulse {
      0%, 100% { box-shadow: 0 2px 12px rgba(18,138,162,0.06); transform: translateY(0); }
      50%       { box-shadow: 0 8px 26px rgba(18,138,162,0.12); transform: translateY(-3px); }
    }

    .cv-card-img-wrap {
      height: 140px; display: flex; align-items: center; justify-content: center;
      padding: 20px; background: #fafbfc;
      border-bottom: 1px solid rgba(18,138,162,0.06);
    }
    .cv-card-img-wrap img {
      max-width: 100%; max-height: 100px; object-fit: contain;
      filter: grayscale(20%); transition: filter .25s;
    }
    .cv-card:hover .cv-card-img-wrap img { filter: grayscale(0%); }

    .cv-card-placeholder {
      width: 64px; height: 64px; border-radius: 50%;
      background: rgba(18,138,162,0.06); display: flex; align-items: center; justify-content: center;
    }
    .cv-card-placeholder i { font-size: 26px; color: rgba(18,138,162,0.3); }

    .cv-card-body { padding: 16px 18px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .cv-card-name {
      font-size: 14px; font-weight: 700; color: #128AA2; line-height: 1.35;
      text-align: center; margin: 0;
    }
    .cv-card-inst {
      font-size: 12px; color: #888; text-align: center; margin-top: 5px;
    }

    .cv-skel {
      background: #fff; border-radius: 16px; overflow: hidden;
      border: 1.5px solid rgba(18,138,162,0.06);
      box-shadow: 0 2px 12px rgba(18,138,162,0.04);
    }
    .cv-skel-img { height: 140px; background: #eef0f2; animation: cv-sk 1.4s ease-in-out infinite; }
    .cv-skel-body { padding: 16px 18px; }
    .cv-skel-line {
      height: 13px; border-radius: 6px; background: #eef0f2;
      animation: cv-sk 1.4s ease-in-out infinite;
    }
    .cv-skel-line.short { width: 55%; margin: 8px auto 0; }
    @keyframes cv-sk { 0%,100%{opacity:1} 50%{opacity:.45} }

    .cv-empty {
      text-align: center; padding: 80px 20px;
      background: #fff; border-radius: 20px;
      border: 1.5px dashed rgba(18,138,162,0.15);
    }
    .cv-empty i { font-size: 48px; color: rgba(18,138,162,0.2); margin-bottom: 16px; }
    .cv-empty p { color: #999; font-size: 15px; }

    .cv-section-head { text-align: center; margin-bottom: 40px; }
    .cv-section-label {
      font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
      color: #FC8900; margin-bottom: 10px;
    }
    .cv-section-title {
      font-size: clamp(22px, 3vw, 32px); font-weight: 800; color: #128AA2; margin-bottom: 10px;
    }
    .cv-section-sub { font-size: 14.5px; color: #666; max-width: 520px; margin: 0 auto; }

    .cv-cta {
      margin-top: 64px; background: #128AA2; border-radius: 20px;
      padding: 48px 32px; text-align: center; position: relative; overflow: hidden;
    }
    .cv-cta::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 80% 20%, rgba(252,137,0,0.18) 0%, transparent 60%);
    }
    .cv-cta-title { color: #fff; font-size: 22px; font-weight: 800; margin-bottom: 10px; position: relative; }
    .cv-cta-sub { color: rgba(255,255,255,0.65); font-size: 14.5px; margin-bottom: 28px; position: relative; }
    .cv-cta-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #FC8900; color: #fff; padding: 13px 32px;
      border-radius: 10px; font-weight: 700; font-size: 14px;
      text-decoration: none; transition: background .2s; position: relative;
    }
    .cv-cta-btn:hover { background: #e07a00; color: #fff; }

    @media (max-width: 575px) {
      .cv-stat-bar { gap: 20px; padding: 18px 16px; }
      .cv-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
      .cv-card-img-wrap { height: 110px; }
    }
  `]
})
export class ConveniosComponent implements OnInit {
  private service = inject(ConvenioService);
  private cdr     = inject(ChangeDetectorRef);

  convenios: Convenio[] = [];
  cargando = true;

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => {
        this.convenios = data
          .map(c => ({ ...c, logo_url: c.logo_url ? `/storage/${c.logo_url}` : null }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
