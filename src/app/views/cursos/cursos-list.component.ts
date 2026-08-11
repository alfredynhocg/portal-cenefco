import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { CursoService } from '../../cursos/application/services/curso.service';
import { Curso } from '../../cursos/domain/models/curso.model';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { CarritoService } from '../../carrito/application/services/carrito.service';

@Component({
    selector: 'app-cursos-list',
    imports: [CommonModule, RouterLink, BreadcrumbComponent, TruncatePipe],
    templateUrl: './cursos-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .cl-hero {
            position: relative;
            min-height: 280px;
            display: flex;
            align-items: flex-end;
            overflow: hidden;
            background: #128AA2;
        }
        .cl-hero-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.22;
        }
        .cl-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.90) 100%);
        }
        .cl-hero-body {
            position: relative;
            z-index: 1;
            padding: 48px 0 36px;
            width: 100%;
            text-align: center;
        }
        .cl-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(255,255,255,0.12);
            color: #fff;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 5px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.22);
            margin-bottom: 14px;
        }
        .cl-hero-badge i { color: #FC8900; }
        .cl-hero-title {
            font-size: clamp(28px, 4vw, 44px);
            font-weight: 800;
            color: #fff;
            line-height: 1.15;
            margin-bottom: 16px;
        }
        .cl-hero-title span { color: #FC8900; }

        .cl-inscripcion-banner {
            background: #f8f9fb;
            border-bottom: 1px solid #e8edf2;
            padding: 10px 0;
        }
        .cl-ib-inner {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        .cl-ib-icon {
            width: 32px;
            height: 32px;
            background: #fff8e1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            font-size: 0.85rem;
            flex-shrink: 0;
        }
        .cl-ib-label {
            font-size: 0.83rem;
            color: #555;
            font-weight: 500;
        }
        .cl-ib-fecha {
            background: #e8f0fe;
            color: #1a56db;
            font-size: 0.82rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 6px;
            letter-spacing: 0.3px;
        }
        .cl-ib-dias {
            background: #dcfce7;
            color: #16a34a;
            font-size: 0.8rem;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .cl-ib-dias.orange { background: #fff7e6; color: #d97706; }
        .cl-ib-dias.red    { background: #fef2f2; color: #dc2626; }
        .cl-ib-btn {
            margin-left: auto;
            background: #0a3d62;
            color: #fff;
            font-size: 0.82rem;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: 8px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cl-ib-btn:hover { background: #1565a8; color: #fff; }
        .cl-ib-bell {
            display: inline-block;
            animation: bellRing 2.5s ease-in-out infinite;
            transform-origin: top center;
        }
        @keyframes bellRing {
            0%, 100%  { transform: rotate(0deg); }
            8%        { transform: rotate(14deg); }
            16%       { transform: rotate(-12deg); }
            24%       { transform: rotate(10deg); }
            32%       { transform: rotate(-8deg); }
            40%       { transform: rotate(0deg); }
        }

        .cl-section { background: #f4f7f9; padding: 48px 0 80px; }

        .cl-search-wrap {
            position: relative;
            max-width: 520px;
            margin: 0 auto 32px;
        }
        .cl-search-input {
            width: 100%;
            padding: 14px 56px 14px 20px;
            border: 1.5px solid rgba(18,138,162,0.15);
            border-radius: 12px;
            font-size: 14.5px;
            color: #333;
            background: #fff;
            outline: none;
            box-shadow: 0 3px 14px rgba(18,138,162,0.07);
            transition: border-color .2s, box-shadow .2s;
            box-sizing: border-box;
            font-family: inherit;
        }
        .cl-search-input:focus {
            border-color: #128AA2;
            box-shadow: 0 0 0 3px rgba(18,138,162,0.08);
        }
        .cl-search-icon {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #128AA2;
            font-size: 15px;
            pointer-events: none;
        }
        .cl-search-clear {
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #aaa;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            line-height: 1;
        }
        .cl-search-clear:hover { color: #128AA2; }

        .cl-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            margin-bottom: 28px;
        }
        .cl-filter-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 18px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            border: 1.5px solid rgba(18,138,162,0.18);
            background: #fff;
            color: #555;
            cursor: pointer;
            transition: all .25s ease;
            text-decoration: none;
        }
        .cl-filter-btn:hover {
            border-color: #128AA2;
            color: #128AA2;
        }
        .cl-filter-btn.active {
            background: #128AA2;
            border-color: #128AA2;
            color: #fff;
            box-shadow: 0 3px 10px rgba(18,138,162,0.22);
        }

        .cl-results-label {
            text-align: center;
            font-size: 13px;
            color: #999;
            margin-bottom: 24px;
        }

        .cl-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            display: flex;
            flex-direction: column;
            height: 100%;
            transition: transform .3s ease, box-shadow .3s ease;
        }
        .cl-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(18,138,162,0.13);
        }

        .cl-card-img {
            position: relative;
            height: 210px;
            overflow: hidden;
            flex-shrink: 0;
        }
        .cl-card-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .5s ease;
        }
        .cl-card:hover .cl-card-img img { transform: scale(1.06); }
        .cl-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(18,138,162,0.04) 0%, rgba(18,138,162,0.55) 100%);
            pointer-events: none;
        }
        .cl-card-tag {
            position: absolute;
            top: 14px;
            left: 14px;
            background: #FC8900;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 11px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(252,137,0,0.35);
        }
        .cl-card-type {
            position: absolute;
            bottom: 12px;
            right: 12px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(6px);
            color: #fff;
            font-size: 10px;
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.25);
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .cl-card-type i { font-size: 9px; color: #FC8900; }

        .cl-card-body {
            padding: 20px 22px 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .cl-card-title {
            font-size: 15.5px;
            font-weight: 700;
            color: #128AA2;
            line-height: 1.4;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-decoration: none;
            transition: color .2s;
        }
        .cl-card-title:hover { color: #FC8900; }
        .cl-card-desc {
            font-size: 13px;
            color: #777;
            line-height: 1.65;
            flex: 1;
            margin-bottom: 18px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .cl-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 14px;
            border-top: 1px solid rgba(18,138,162,0.07);
            gap: 8px;
        }
        .cl-card-meta {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 11.5px;
            color: #aaa;
        }
        .cl-card-meta i { color: #FC8900; font-size: 10px; }
        .cl-card-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12.5px;
            font-weight: 700;
            color: #128AA2;
            border: 1.5px solid rgba(18,138,162,0.22);
            border-radius: 8px;
            padding: 7px 14px;
            text-decoration: none;
            transition: all .25s ease;
            flex-shrink: 0;
        }
        .cl-card-btn:hover {
            background: #128AA2;
            border-color: #128AA2;
            color: #fff;
        }
        .cl-card-btn i { font-size: 10px; }
        .cl-skeleton {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
        }
        .cl-skel-img {
            height: 210px;
            background: #eef0f2;
            animation: cl-pulse 1.4s ease-in-out infinite;
        }
        .cl-skel-body { padding: 20px 22px; }
        .cl-skel-line {
            height: 13px;
            border-radius: 6px;
            background: #eef0f2;
            margin-bottom: 10px;
            animation: cl-pulse 1.4s ease-in-out infinite;
        }
        .cl-skel-line.short { width: 60%; }
        .cl-skel-line.xs    { width: 35%; }
        @keyframes cl-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: .45; }
        }

        .cl-empty {
            text-align: center;
            padding: 60px 24px;
            color: #bbb;
        }
        .cl-empty i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }
        .cl-empty p { font-size: 15px; margin: 0; }

        .cl-pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 40px;
        }
        .cl-page-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            border-radius: 9px;
            border: 1.5px solid rgba(18,138,162,0.18);
            background: #fff;
            color: #128AA2;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all .22s ease;
            text-decoration: none;
        }
        .cl-page-btn:hover:not(:disabled):not(.active) {
            border-color: #128AA2;
            background: rgba(18,138,162,0.05);
        }
        .cl-page-btn.active {
            background: #128AA2;
            border-color: #128AA2;
            color: #fff;
            box-shadow: 0 3px 10px rgba(18,138,162,0.22);
        }
        .cl-page-btn:disabled { opacity: 0.30; cursor: not-allowed; }

        .cl-animating { opacity: 0; transition: opacity .05s; }

        .cl-card-precio {
            font-size: 1.05rem;
            font-weight: 700;
            color: #128AA2;
            padding: 6px 0 0;

            small {
                font-size: 0.75rem;
                font-weight: 400;
                color: #888;
                margin-left: 4px;
            }
        }
        .cl-card-carrito-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            width: 100%;
            margin-top: 12px;
            padding: 10px 16px;
            border-radius: 9px;
            font-size: 13px;
            font-weight: 700;
            border: none;
            background: #128AA2;
            color: #fff;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.2s, transform 0.1s;
        }
        .cl-card-carrito-btn:hover {
            background: #0a3d62;
            color: #fff;
            transform: translateY(-1px);
        }
        .cl-card-carrito-btn--en {
            background: #16a34a;
        }
        .cl-card-carrito-btn--en:hover {
            background: #15803d;
        }

        @media (max-width: 767px) {
            .cl-card-img { height: 190px; }
            .cl-hero-body { padding: 32px 0 24px; }
        }
    `]
})
export class CursosListComponent implements OnInit, OnDestroy {

    private cursoService = inject(CursoService);
    private cdr = inject(ChangeDetectorRef);
    readonly carritoService = inject(CarritoService);
    private animTimer?: ReturnType<typeof setTimeout>;
    
    readonly PAGOS_HABILITADOS = false;

    cursos: Curso[] = [];
    categorias: { nombre: string }[] = [];
    categoriaActiva: string | null = null;
    busqueda = '';
    cargando = true;
    animating = false;

    pageSize = 6;
    pageIndex = 1;

    get cursosFiltrados(): Curso[] {
        let result = this.cursos;
        if (this.categoriaActiva) {
            result = result.filter(c => c.categoria_nombre === this.categoriaActiva);
        }
        if (this.busqueda.trim()) {
            const q = this.busqueda.trim().toLowerCase();
            result = result.filter(c => c.nombre_programa.toLowerCase().includes(q));
        }
        return result;
    }

    get totalPages(): number {
        return Math.ceil(this.cursosFiltrados.length / this.pageSize);
    }

    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    get cursosPagina(): Curso[] {
        const start = (this.pageIndex - 1) * this.pageSize;
        return this.cursosFiltrados.slice(start, start + this.pageSize);
    }

    get labelResultados(): string {
        const total = this.cursosFiltrados.length;
        const desde = Math.min((this.pageIndex - 1) * this.pageSize + 1, total);
        const hasta = Math.min(this.pageIndex * this.pageSize, total);
        if (total === 0) return '';
        let label = `Mostrando ${desde}–${hasta} de ${total} curso${total !== 1 ? 's' : ''}`;
        if (this.categoriaActiva) label += ` · ${this.categoriaActiva}`;
        if (this.busqueda.trim()) label += ` · "${this.busqueda.trim()}"`;
        return label;
    }

    ngOnInit(): void {
        this.cursoService.getAll(200).subscribe({
            next: (res) => {
                this.cursos = res.data;
                const nombres = [...new Set(res.data.map(c => c.categoria_nombre).filter((c): c is string => !!c))];
                this.categorias = nombres.map(n => ({ nombre: n }));
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    onBusqueda(event: Event): void {
        this.busqueda = (event.target as HTMLInputElement).value;
        this.pageIndex = 1;
        this.triggerAnimation();
    }

    limpiarBusqueda(): void {
        this.busqueda = '';
        this.pageIndex = 1;
        this.triggerAnimation();
    }

    filtrarCategoria(nombre: string | null): void {
        this.categoriaActiva = nombre;
        this.pageIndex = 1;
        this.triggerAnimation();
    }

    irPagina(page: number): void {
        if (page < 1 || page > this.totalPages) return;
        this.pageIndex = page;
        this.triggerAnimation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    agregarAlCarrito(curso: Curso): void {
        this.carritoService.agregar(curso);
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        clearTimeout(this.animTimer);
    }

    private triggerAnimation(): void {
        this.animating = true;
        this.cdr.detectChanges();
        this.animTimer = setTimeout(() => {
            this.animating = false;
            this.cdr.detectChanges();
        }, 50);
    }
}
