import { Component, inject, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ResenaService, Resena } from '../../cursos/application/services/resena.service';
import { createPaginatedList } from '../../core/utils/paginated-list';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './resenas.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .rs-hero {
      position: relative; min-height: 260px;
      display: flex; align-items: flex-end; overflow: hidden;
      background: #128AA2;
    }
    .rs-hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(18,138,162,0.45) 0%, rgba(18,138,162,0.92) 100%);
    }
    .rs-hero-body { position: relative; z-index: 1; padding: 48px 0 36px; width: 100%; text-align: center; }
    .rs-hero-badge {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(255,255,255,0.12); color: #fff;
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
      padding: 5px 16px; border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
    }
    .rs-hero-badge i { color: #FC8900; }
    .rs-hero-title { font-size: clamp(26px, 4vw, 42px); font-weight: 800; color: #fff; margin-bottom: 10px; }
    .rs-hero-title span { color: #FC8900; }
    .rs-hero-sub { color: rgba(255,255,255,0.65); font-size: 15px; }

    .rs-stats {
      background: #fff; border-bottom: 1px solid rgba(18,138,162,0.08);
      padding: 20px 0;
    }
    .rs-stats-inner {
      display: flex; align-items: center; gap: 32px; flex-wrap: wrap; justify-content: center;
    }
    .rs-stat { display: flex; align-items: center; gap: 10px; }
    .rs-stat-num { font-size: 26px; font-weight: 800; color: #128AA2; line-height: 1; }
    .rs-stat-label { font-size: 12px; color: #888; font-weight: 500; }
    .rs-stat-divider { width: 1px; height: 36px; background: rgba(18,138,162,0.12); }
    .rs-stars-big { display: flex; gap: 3px; }
    .rs-stars-big i { color: #FC8900; font-size: 18px; }

    .rs-section { background: #f4f7f9; padding: 52px 0 90px; }

    .rs-card {
      background: #fff; border-radius: 16px; padding: 28px 24px 24px;
      border: 1px solid rgba(18,138,162,0.07);
      box-shadow: 0 4px 20px rgba(18,138,162,0.07);
      display: flex; flex-direction: column; height: 100%;
      transition: transform .3s ease, box-shadow .3s ease;
    }
    .rs-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(18,138,162,0.12); }

    .rs-card-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
    .rs-avatar {
      width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0;
      object-fit: cover; border: 2.5px solid rgba(18,138,162,0.12);
    }
    .rs-avatar-placeholder {
      width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #128AA2 0%, #1A6080 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 800; color: #fff;
      border: 2.5px solid rgba(18,138,162,0.12);
    }
    .rs-meta { flex: 1; min-width: 0; }
    .rs-name { font-size: 15px; font-weight: 700; color: #128AA2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rs-cargo { font-size: 12.5px; color: #888; margin-top: 1px; }
    .rs-verificado {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 600; color: #16a34a;
      background: rgba(22,163,74,0.08); padding: 2px 8px; border-radius: 20px;
      margin-top: 5px;
    }

    .rs-stars { display: flex; gap: 3px; margin-bottom: 12px; }
    .rs-stars i { font-size: 13px; }
    .rs-stars i.filled { color: #FC8900; }
    .rs-stars i.empty  { color: #e0e0e0; }

    .rs-titulo { font-size: 14px; font-weight: 700; color: #128AA2; margin-bottom: 8px; }
    .rs-texto {
      font-size: 14px; color: #555; line-height: 1.7; flex: 1;
      display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden;
    }

    .rs-footer {
      margin-top: 16px; padding-top: 14px;
      border-top: 1px solid rgba(18,138,162,0.07);
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    .rs-programa {
      display: flex; align-items: center; gap: 5px;
      font-size: 11.5px; color: #128AA2; font-weight: 600;
      background: rgba(18,138,162,0.06); padding: 4px 10px; border-radius: 20px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
    }
    .rs-programa i { font-size: 10px; color: #FC8900; flex-shrink: 0; }
    .rs-fecha { font-size: 11px; color: #aaa; flex-shrink: 0; }

    .rs-quote-icon {
      position: absolute; top: 20px; right: 22px;
      font-size: 40px; color: rgba(18,138,162,0.05);
      font-family: Georgia, serif; line-height: 1;
    }

    .rs-skel {
      background: #fff; border-radius: 16px; padding: 28px 24px 24px;
      border: 1px solid rgba(18,138,162,0.07); height: 240px;
    }
    .rs-skel-line { border-radius: 6px; background: #eef0f2; animation: rs-pulse 1.4s ease-in-out infinite; }
    @keyframes rs-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

    .rs-pagination {
      display: flex; align-items: center; justify-content: center;
      gap: 6px; margin-top: 48px;
    }
    .rs-page-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 9px;
      border: 1.5px solid rgba(18,138,162,0.18); background: #fff;
      color: #128AA2; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all .22s ease;
    }
    .rs-page-btn:hover:not(:disabled):not(.active) { border-color: #128AA2; background: rgba(18,138,162,0.05); }
    .rs-page-btn.active { background: #128AA2; border-color: #128AA2; color: #fff; box-shadow: 0 3px 10px rgba(18,138,162,0.22); }
    .rs-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    @media (max-width: 767px) {
      .rs-hero-body { padding: 32px 0 24px; }
      .rs-card { padding: 22px 18px 18px; }
      .rs-stats-inner { gap: 20px; }
      .rs-stat-divider { display: none; }
    }
  `]
})
export class ResenasComponent implements OnInit {
  private service = inject(ResenaService);
  private cdr     = inject(ChangeDetectorRef);

  private _promedioCalif = '5.0';

  private list = createPaginatedList<Resena>({
    fetchFn: (pageIndex, pageSize) => this.service.getAll(pageIndex, pageSize),
    cdr: this.cdr,
    pageSize: 9,
  });

  get resenas()    { return this.list.items; }
  get total()      { return this.list.total; }
  get cargando()   { return this.list.cargando; }
  get pageIndex()  { return this.list.pageIndex; }
  get totalPages() { return this.list.totalPages(); }
  get pages()      { return this.list.pages(); }

  get promedioCalif(): string { return this._promedioCalif; }

  ngOnInit(): void {
    this.service.getAll(1, 100).subscribe({
      next: res => {
        if (res.data.length) {
          const sum = res.data.reduce((acc, r) => acc + (r.calificacion ?? 5), 0);
          this._promedioCalif = (sum / res.data.length).toFixed(1);
          this.cdr.detectChanges();
        }
      },
    });
    this.list.cargar();
  }
  goToPage(page: number): void { this.list.goToPage(page); }

  starsArray(calificacion: number): { filled: boolean }[] {
    return Array.from({ length: 5 }, (_, i) => ({ filled: i < calificacion }));
  }

  getIniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  getFotoUrl(foto: string | null): string {
    if (!foto) return '';
    if (foto.startsWith('http')) return foto;
    return `/storage/${foto}`;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-BO', { year: 'numeric', month: 'short' });
  }
}
