import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { ArticuloService } from '../../articulos/application/services/articulo.service';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { Articulo } from '../../articulos/domain/models/articulo.model';
import { createPaginatedList } from '../../core/utils/paginated-list';

@Component({
    selector: 'app-noticias-list',
    imports: [BreadcrumbComponent, CommonModule, RouterLink, ImageUrlPipe],
    templateUrl: './noticias-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .nn-hero {
            position: relative;
            min-height: 280px;
            display: flex;
            align-items: flex-end;
            overflow: hidden;
            background: #128AA2;
        }
        .nn-hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; opacity: 0.22;
        }
        .nn-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.92) 100%);
        }
        .nn-hero-body {
            position: relative; z-index: 1;
            padding: 48px 0 36px; width: 100%; text-align: center;
        }
        .nn-hero-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(255,255,255,0.12); color: #fff;
            font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
            padding: 5px 16px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
        }
        .nn-hero-badge i { color: #FC8900; }
        .nn-hero-title {
            font-size: clamp(28px, 4vw, 44px); font-weight: 800;
            color: #fff; line-height: 1.15; margin-bottom: 16px;
        }
        .nn-hero-title span { color: #FC8900; }

        .nn-section { background: #f4f7f9; padding: 48px 0 80px; }

        .nn-card {
            background: #fff; border-radius: 16px; overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            display: flex; flex-direction: column; height: 100%;
            transition: transform .3s ease, box-shadow .3s ease;
        }
        .nn-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(18,138,162,0.13);
        }

        .nn-card-img {
            position: relative; height: 210px;
            overflow: hidden; flex-shrink: 0;
        }
        .nn-card-img img {
            width: 100%; height: 100%; object-fit: cover;
            transition: transform .5s ease;
        }
        .nn-card:hover .nn-card-img img { transform: scale(1.06); }
        .nn-card-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, transparent 40%, rgba(18,138,162,0.60) 100%);
            pointer-events: none;
        }
        .nn-card-tag {
            position: absolute; top: 14px; left: 14px;
            background: #FC8900; color: #fff;
            font-size: 10px; font-weight: 700;
            padding: 4px 11px; border-radius: 20px;
            text-transform: uppercase; letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(252,137,0,0.35);
            display: flex; align-items: center; gap: 4px;
        }
        .nn-card-date {
            position: absolute; bottom: 12px; right: 12px;
            background: rgba(255,255,255,0.15); backdrop-filter: blur(6px);
            color: #fff; font-size: 11px; font-weight: 600;
            padding: 4px 10px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.25);
            display: flex; align-items: center; gap: 5px;
        }
        .nn-card-date i { color: #FC8900; font-size: 10px; }

        .nn-card-body {
            padding: 20px 22px 20px;
            display: flex; flex-direction: column; flex: 1;
        }
        .nn-card-title {
            font-size: 15.5px; font-weight: 700; color: #128AA2;
            line-height: 1.4; margin-bottom: 10px;
            display: -webkit-box; -webkit-line-clamp: 2;
            -webkit-box-orient: vertical; overflow: hidden;
            text-decoration: none; transition: color .2s;
        }
        .nn-card-title:hover { color: #FC8900; }
        .nn-card-desc {
            font-size: 13px; color: #777; line-height: 1.65;
            flex: 1; margin-bottom: 18px;
            display: -webkit-box; -webkit-line-clamp: 3;
            -webkit-box-orient: vertical; overflow: hidden;
        }
        .nn-card-footer {
            display: flex; align-items: center;
            justify-content: space-between;
            padding-top: 14px; border-top: 1px solid rgba(18,138,162,0.07); gap: 8px;
        }
        .nn-card-meta {
            display: flex; align-items: center; gap: 5px;
            font-size: 11.5px; color: #bbb;
        }
        .nn-card-meta i { color: #FC8900; font-size: 10px; }
        .nn-card-btn {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: 12.5px; font-weight: 700; color: #128AA2;
            border: 1.5px solid rgba(18,138,162,0.22); border-radius: 8px;
            padding: 7px 14px; text-decoration: none;
            transition: all .25s ease; flex-shrink: 0;
        }
        .nn-card-btn:hover { background: #128AA2; border-color: #128AA2; color: #fff; }
        .nn-card-btn i { font-size: 10px; }

        .nn-card-featured .nn-card-img { height: 280px; }
        .nn-card-featured .nn-card-title { font-size: 17px; -webkit-line-clamp: 3; }

        .nn-skeleton { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(18,138,162,0.07); }
        .nn-skel-img { height: 210px; background: #eef0f2; animation: nn-pulse 1.4s ease-in-out infinite; }
        .nn-skel-body { padding: 20px 22px; }
        .nn-skel-line { height: 13px; border-radius: 6px; background: #eef0f2; margin-bottom: 10px; animation: nn-pulse 1.4s ease-in-out infinite; }
        .nn-skel-line.short { width: 55%; }
        .nn-skel-line.xs    { width: 35%; margin-top: 8px; }
        @keyframes nn-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

        .nn-empty { text-align: center; padding: 60px 24px; color: #bbb; }
        .nn-empty i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }
        .nn-empty p { font-size: 15px; margin: 0; }

        .nn-pagination {
            display: flex; align-items: center;
            justify-content: center; gap: 6px; margin-top: 40px;
        }
        .nn-page-btn {
            display: inline-flex; align-items: center; justify-content: center;
            width: 38px; height: 38px; border-radius: 9px;
            border: 1.5px solid rgba(18,138,162,0.18); background: #fff;
            color: #128AA2; font-size: 13px; font-weight: 600;
            cursor: pointer; transition: all .22s ease; text-decoration: none;
        }
        .nn-page-btn:hover:not(:disabled):not(.active) {
            border-color: #128AA2; background: rgba(18,138,162,0.05);
        }
        .nn-page-btn.active { background: #128AA2; border-color: #128AA2; color: #fff; box-shadow: 0 3px 10px rgba(18,138,162,0.22); }
        .nn-page-btn:disabled { opacity: 0.30; cursor: not-allowed; }
        .nn-page-info { text-align: center; margin-top: 14px; font-size: 13px; color: #aaa; }

        @media (max-width: 767px) {
            .nn-card-img { height: 190px; }
            .nn-hero-body { padding: 32px 0 24px; }
        }
    `]
})
export class NoticiasListComponent implements OnInit {
    private articuloService = inject(ArticuloService);
    private cdr = inject(ChangeDetectorRef);
    private list = createPaginatedList<Articulo>({
        fetchFn: (pageIndex, pageSize) => this.articuloService.getPaginado(pageIndex, pageSize),
        cdr: this.cdr,
        pageSize: 9,
    });

    get articulos()  { return this.list.items; }
    get total()      { return this.list.total; }
    get cargando()   { return this.list.cargando; }
    get pageIndex()  { return this.list.pageIndex; }
    get totalPages() { return this.list.totalPages(); }
    get pages()      { return this.list.pages(); }

    ngOnInit(): void { this.list.cargar(); }
    goToPage(page: number): void { this.list.goToPage(page); }

    getPrimeraEtiqueta(articulo: Articulo): string | null {
        return articulo.etiquetas?.length > 0 ? articulo.etiquetas[0].nombre : null;
    }
}
