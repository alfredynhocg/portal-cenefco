import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../../biblioteca/application/services/publicacion.service';
import { Publicacion } from '../../biblioteca/domain/models/publicacion.model';
import { BIBLIOTECA_CONSTANCE } from '../../core/constants/biblioteca.constance';

@Component({
    selector: 'app-biblioteca-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './biblioteca-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .bl-hero {
            position: relative;
            min-height: 300px;
            display: flex;
            align-items: flex-end;
            overflow: hidden;
            background: #128AA2;
        }
        .bl-hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; opacity: .45;
        }
        .bl-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(18,138,162,.72) 0%, rgba(4,40,55,.82) 100%);
        }
        .bl-hero-body {
            position: relative; z-index: 1;
            padding: 56px 0 44px; width: 100%;
        }
        .bl-hero-badge {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(252,137,0,.15); color: #FC8900;
            font-size: 11px; font-weight: 700; letter-spacing: .8px;
            text-transform: uppercase;
            padding: 5px 16px; border-radius: 20px;
            border: 1px solid rgba(252,137,0,.3);
            margin-bottom: 16px;
        }
        .bl-hero-title {
            font-size: clamp(30px,4.5vw,50px); font-weight: 800;
            color: #fff; line-height: 1.1; margin-bottom: 10px;
        }
        .bl-hero-title span { color: #FC8900; }
        .bl-hero-sub {
            color: rgba(255,255,255,.65); font-size: 15px;
            max-width: 500px; line-height: 1.65; margin-bottom: 28px;
        }
        .bl-hero-stats {
            display: flex; gap: 32px; flex-wrap: wrap;
        }
        .bl-hero-stat { display: flex; flex-direction: column; gap: 2px; }
        .bl-hero-stat strong {
            font-size: 24px; font-weight: 800; color: #FC8900; line-height: 1;
        }
        .bl-hero-stat span { font-size: 11px; color: rgba(255,255,255,.55); font-weight: 600; letter-spacing: .3px; }
        .bl-section { background: #f2f5f8; padding: 44px 0 80px; }
        .bl-layout { display: grid; grid-template-columns: 280px 1fr; gap: 28px; align-items: start; }
        @media (max-width: 991px) { .bl-layout { grid-template-columns: 1fr; } }

        .bl-sidebar { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 16px; }
        @media (max-width: 991px) { .bl-sidebar { position: static; } }

        .bl-panel {
            background: #fff; border-radius: 16px;
            box-shadow: 0 2px 16px rgba(18,138,162,.07);
            overflow: hidden;
        }
        .bl-panel-head {
            padding: 14px 20px; border-bottom: 1px solid rgba(18,138,162,.07);
            display: flex; align-items: center; gap: 8px;
        }
        .bl-panel-head i { color: #FC8900; font-size: 14px; }
        .bl-panel-head span { font-size: 12px; font-weight: 700; color: #128AA2; letter-spacing: .4px; text-transform: uppercase; }
        .bl-panel-body { padding: 16px 20px; }

        .bl-search-wrap { position: relative; }
        .bl-search-input {
            width: 100%; padding: 11px 40px 11px 16px;
            border: 1.5px solid rgba(18,138,162,.13); border-radius: 10px;
            font-size: 13.5px; color: #128AA2; background: #f8fbfc;
            outline: none; transition: border-color .2s, box-shadow .2s;
            font-family: inherit; box-sizing: border-box;
        }
        .bl-search-input::placeholder { color: rgba(18,138,162,.35); }
        .bl-search-input:focus {
            border-color: #128AA2; background: #fff;
            box-shadow: 0 0 0 3px rgba(18,138,162,.08);
        }
        .bl-search-icon {
            position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
            color: rgba(18,138,162,.4); font-size: 13px; pointer-events: none;
        }
        .bl-search-clear {
            position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
            background: rgba(18,138,162,.1); border: none; border-radius: 50%;
            width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; color: #128AA2; font-size: 10px;
        }
        .bl-search-clear:hover { background: rgba(18,138,162,.2); }

        .bl-tipo-list { display: flex; flex-direction: column; gap: 4px; }
        .bl-tipo-btn {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; border-radius: 10px;
            border: none; background: transparent;
            color: rgba(18,138,162,.7); font-size: 13px; font-weight: 600;
            cursor: pointer; text-align: left; width: 100%;
            transition: all .2s;
        }
        .bl-tipo-btn:hover { background: rgba(18,138,162,.05); color: #128AA2; }
        .bl-tipo-btn.active { background: #128AA2; color: #fff; }
        .bl-tipo-btn .bl-tipo-icon {
            width: 32px; height: 32px; border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; flex-shrink: 0;
            background: rgba(18,138,162,.08); color: #128AA2;
            transition: background .2s, color .2s;
        }
        .bl-tipo-btn.active .bl-tipo-icon { background: rgba(255,255,255,.15); color: #fff; }
        .bl-tipo-btn .bl-tipo-label { flex: 1; }
        .bl-tipo-count {
            font-size: 11px; font-weight: 700;
            background: rgba(18,138,162,.08); color: rgba(18,138,162,.55);
            padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
        }
        .bl-tipo-btn.active .bl-tipo-count { background: rgba(255,255,255,.2); color: rgba(255,255,255,.8); }

        .bl-select-group { display: flex; flex-direction: column; gap: 10px; }
        .bl-select-wrap { position: relative; }
        .bl-select-wrap i {
            position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
            color: rgba(18,138,162,.4); font-size: 12px; pointer-events: none;
        }
        .bl-select {
            width: 100%; padding: 10px 12px 10px 32px;
            border: 1.5px solid rgba(18,138,162,.13); border-radius: 10px;
            background: #f8fbfc; color: #128AA2;
            font-size: 13px; font-weight: 500; appearance: none;
            outline: none; cursor: pointer; font-family: inherit;
            transition: border-color .2s;
        }
        .bl-select:focus { border-color: #128AA2; background: #fff; }

        .bl-clear-btn {
            width: 100%; padding: 10px; border-radius: 10px;
            border: 1.5px solid rgba(252,137,0,.3); background: rgba(252,137,0,.06);
            color: #FC8900; font-size: 13px; font-weight: 700;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
            transition: all .2s;
        }
        .bl-clear-btn:hover { background: rgba(252,137,0,.12); border-color: #FC8900; }

        .bl-main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

        .bl-topbar {
            display: flex; align-items: center; justify-content: space-between;
            background: #fff; border-radius: 12px;
            padding: 14px 20px;
            box-shadow: 0 2px 12px rgba(18,138,162,.06);
            gap: 12px; flex-wrap: wrap;
        }
        .bl-count { font-size: 14px; color: rgba(18,138,162,.6); }
        .bl-count strong { color: #128AA2; font-weight: 700; }
        .bl-active-filters { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; justify-content: flex-end; }
        .bl-filter-chip {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 4px 12px; border-radius: 20px;
            background: rgba(18,138,162,.07); color: #128AA2;
            font-size: 12px; font-weight: 600; border: none; cursor: pointer;
        }
        .bl-filter-chip i { font-size: 10px; opacity: .6; }
        .bl-filter-chip:hover { background: rgba(18,138,162,.13); }

        .bl-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
            gap: 20px;
        }

        .bl-card {
            background: #fff; border-radius: 16px;
            border: 1px solid rgba(18,138,162,.07);
            box-shadow: 0 3px 18px rgba(18,138,162,.06);
            display: flex; flex-direction: column; height: 100%;
            transition: transform .3s ease, box-shadow .3s ease;
            overflow: hidden;
        }
        .bl-card:hover { transform: translateY(-5px); box-shadow: 0 14px 40px rgba(18,138,162,.12); }

        .bl-card-header {
            padding: 20px 20px 0;
            display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
        }
        .bl-card-tipo-pill {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 5px 12px; border-radius: 20px;
            font-size: 10.5px; font-weight: 700; letter-spacing: .3px;
            flex-shrink: 0;
        }
        .bl-pill-tesis              { background: rgba(18,138,162,.1);    color: #128AA2; }
        .bl-pill-monografia         { background: rgba(91,43,138,.1);  color: #5b2b8a; }
        .bl-pill-revista            { background: rgba(14,125,94,.1);  color: #0e7d5e; }
        .bl-pill-revista-cientifica { background: rgba(201,75,0,.1);   color: #c94b00; }

        .bl-card-anio {
            font-size: 12px; font-weight: 700; color: rgba(18,138,162,.4);
            flex-shrink: 0;
        }

        .bl-card-icon-wrap {
            margin: 14px 20px 0;
            width: 50px; height: 50px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px;
        }
        .bl-icon-tesis              { background: rgba(18,138,162,.08);   color: #128AA2; }
        .bl-icon-monografia         { background: rgba(91,43,138,.08); color: #5b2b8a; }
        .bl-icon-revista            { background: rgba(14,125,94,.08); color: #0e7d5e; }
        .bl-icon-revista-cientifica { background: rgba(201,75,0,.08);  color: #c94b00; }

        .bl-card-body { padding: 12px 20px 20px; display: flex; flex-direction: column; flex: 1; }
        .bl-card-title {
            font-size: 15px; font-weight: 700; color: #128AA2;
            line-height: 1.4; margin-bottom: 6px;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .bl-card-author {
            font-size: 12.5px; color: rgba(18,138,162,.5);
            display: flex; align-items: center; gap: 5px; margin-bottom: 10px;
        }
        .bl-card-author i { font-size: 11px; }
        .bl-card-resumen {
            font-size: 13px; color: #777; line-height: 1.6;
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
            flex: 1; margin-bottom: 16px;
        }
        .bl-card-divider { height: 1px; background: rgba(18,138,162,.07); margin-bottom: 14px; }
        .bl-card-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .bl-meta-item {
            display: inline-flex; align-items: center; gap: 4px;
            font-size: 11px; color: rgba(18,138,162,.5); font-weight: 600;
        }
        .bl-meta-item i { font-size: 10px; color: #FC8900; }

        .bl-card-actions { display: flex; gap: 8px; margin-top: auto; }
        .bl-btn-dl {
            flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
            padding: 9px 0; background: #128AA2; color: #fff;
            border-radius: 10px; font-size: 12.5px; font-weight: 700;
            text-decoration: none; border: none; cursor: pointer;
            transition: background .2s, transform .15s;
        }
        .bl-btn-dl:hover { background: #055470; color: #fff; transform: translateY(-1px); }
        .bl-btn-dl i { font-size: 12px; }
        .bl-btn-link {
            display: inline-flex; align-items: center; justify-content: center;
            width: 38px; height: 38px;
            border: 1.5px solid rgba(18,138,162,.18); border-radius: 10px;
            color: #128AA2; text-decoration: none;
            font-size: 13px;
            transition: all .2s; flex-shrink: 0;
        }
        .bl-btn-link:hover { background: #128AA2; color: #fff; border-color: #128AA2; }

        .bl-skel {
            background: #fff; border-radius: 16px; overflow: hidden;
            border: 1px solid rgba(18,138,162,.06);
        }
        .bl-skel-top { height: 12px; width: 40%; background: #e8eef2; border-radius: 6px; margin: 20px 20px 14px; animation: bl-pulse 1.4s ease-in-out infinite; }
        .bl-skel-icon { width: 50px; height: 50px; border-radius: 12px; background: #e8eef2; margin: 0 20px 14px; animation: bl-pulse 1.4s ease-in-out infinite; }
        .bl-skel-body { padding: 0 20px 20px; }
        .bl-skel-line { height: 12px; border-radius: 6px; background: #e8eef2; margin-bottom: 9px; animation: bl-pulse 1.4s ease-in-out infinite; }
        .bl-skel-line.w90 { width: 90%; }
        .bl-skel-line.w70 { width: 70%; }
        .bl-skel-line.w50 { width: 50%; }
        @keyframes bl-pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

        .bl-empty {
            background: #fff; border-radius: 16px; text-align: center;
            padding: 64px 24px; grid-column: 1 / -1;
            border: 1px solid rgba(18,138,162,.06);
        }
        .bl-empty-icon {
            width: 72px; height: 72px; border-radius: 50%;
            background: rgba(18,138,162,.06);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 18px; font-size: 28px; color: rgba(18,138,162,.3);
        }
        .bl-empty h4 { font-size: 17px; font-weight: 700; color: #128AA2; margin-bottom: 7px; }
        .bl-empty p { color: rgba(18,138,162,.5); font-size: 13.5px; margin-bottom: 22px; }
        .bl-empty-btn {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 10px 24px; background: #128AA2; color: #fff;
            border-radius: 10px; font-size: 13.5px; font-weight: 700;
            border: none; cursor: pointer; transition: background .2s;
        }
        .bl-empty-btn:hover { background: #055470; color: #fff; }

        .bl-pagination {
            display: flex; align-items: center; justify-content: center;
            gap: 6px; flex-wrap: wrap;
        }
        .bl-page-btn {
            min-width: 38px; height: 38px; border-radius: 9px;
            border: 1.5px solid rgba(18,138,162,.15); background: #fff;
            color: #128AA2; font-size: 13px; font-weight: 600;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: all .2s; padding: 0 10px;
        }
        .bl-page-btn:hover:not(:disabled) { border-color: #128AA2; background: rgba(18,138,162,.05); }
        .bl-page-btn.active { background: #128AA2; border-color: #128AA2; color: #fff; box-shadow: 0 3px 10px rgba(18,138,162,.22); }
        .bl-page-btn:disabled { opacity: .3; cursor: not-allowed; }

        @media (max-width: 767px) {
            .bl-hero-stats { gap: 20px; }
            .bl-grid { grid-template-columns: 1fr; }
        }
    `],
})
export class BibliotecaListComponent implements OnInit {
    private svc = inject(PublicacionService);
    private cdr = inject(ChangeDetectorRef);

    readonly CONSTANTS = BIBLIOTECA_CONSTANCE;

    publicaciones: Publicacion[] = [];
    cargando = true;

    busqueda = '';
    tipoActivo = 'todos';
    anioFiltro = '';
    areaFiltro = '';

    pageIndex = 1;
    readonly pageSize = 12;

    get publicacionesFiltradas(): Publicacion[] {
        const q = this.busqueda.trim().toLowerCase();
        return this.publicaciones.filter(p => {
            const matchTipo = this.tipoActivo === 'todos' || p.tipo === this.tipoActivo;
            const matchAnio = !this.anioFiltro || String(p.anio) === this.anioFiltro;
            const matchArea = !this.areaFiltro || p.area === this.areaFiltro;
            const matchQ = !q || [p.titulo, p.autor, p.palabras_clave, p.resumen, p.area]
                .some(v => v?.toLowerCase().includes(q));
            return matchTipo && matchAnio && matchArea && matchQ;
        });
    }

    get publicacionesPagina(): Publicacion[] {
        const start = (this.pageIndex - 1) * this.pageSize;
        return this.publicacionesFiltradas.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        return Math.ceil(this.publicacionesFiltradas.length / this.pageSize);
    }

    get pages(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    get aniosDisponibles(): number[] {
        const set = new Set<number>();
        this.publicaciones.forEach(p => { if (p.anio) set.add(p.anio); });
        return Array.from(set).sort((a, b) => b - a);
    }

    get areasDisponibles(): string[] {
        const set = new Set<string>();
        this.publicaciones.forEach(p => { if (p.area) set.add(p.area); });
        return Array.from(set).sort();
    }

    get hasFiltrosActivos(): boolean {
        return this.busqueda !== '' || this.tipoActivo !== 'todos' || this.anioFiltro !== '' || this.areaFiltro !== '';
    }

    get skeletons(): number[] { return Array(8).fill(0); }

    countTipo(tipo: string): number {
        if (tipo === 'todos') return this.publicaciones.length;
        return this.publicaciones.filter(p => p.tipo === tipo).length;
    }

    ngOnInit(): void {
        this.svc.getAll(500).subscribe({
            next: res => {
                this.publicaciones = res.data ?? [];
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    onBusqueda(): void { this.pageIndex = 1; }
    limpiarBusqueda(): void { this.busqueda = ''; this.pageIndex = 1; }
    filtrarTipo(tipo: string): void { this.tipoActivo = tipo; this.pageIndex = 1; }

    limpiarFiltros(): void {
        this.busqueda = '';
        this.tipoActivo = 'todos';
        this.anioFiltro = '';
        this.areaFiltro = '';
        this.pageIndex = 1;
    }

    irPagina(p: number): void {
        if (p < 1 || p > this.totalPages) return;
        this.pageIndex = p;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getTipoPillClass(tipo: string): string {
        return { 'tesis': 'bl-pill-tesis', 'monografia': 'bl-pill-monografia', 'revista': 'bl-pill-revista', 'revista-cientifica': 'bl-pill-revista-cientifica' }[tipo] ?? 'bl-pill-tesis';
    }

    getTipoIconClass(tipo: string): string {
        return { 'tesis': 'bl-icon-tesis', 'monografia': 'bl-icon-monografia', 'revista': 'bl-icon-revista', 'revista-cientifica': 'bl-icon-revista-cientifica' }[tipo] ?? 'bl-icon-tesis';
    }

    getTipoLabel(tipo: string): string {
        return this.CONSTANTS.tipos.find(x => x.key === tipo)?.label ?? tipo;
    }

    getTipoIcon(tipo: string): string {
        return this.CONSTANTS.tipos.find(x => x.key === tipo)?.icon ?? 'fa-solid fa-book';
    }
}
