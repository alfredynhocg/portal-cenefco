import { ChangeDetectorRef, Component, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { PublicacionService } from '../../biblioteca/application/services/publicacion.service';
import { Publicacion } from '../../biblioteca/domain/models/publicacion.model';

@Component({
    selector: 'app-biblioteca-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './biblioteca-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .bd-hero {
            position: relative; min-height: 280px;
            display: flex; align-items: flex-end;
            overflow: hidden; background: #128AA2;
        }
        .bd-hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; opacity: .45;
        }
        .bd-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(18,138,162,.72) 0%, rgba(4,40,55,.85) 100%);
        }
        .bd-hero-body {
            position: relative; z-index: 1;
            padding: 48px 0 36px; width: 100%;
        }
        .bd-hero-back {
            display: inline-flex; align-items: center; gap: 7px;
            color: rgba(255,255,255,.65); font-size: 13px; font-weight: 600;
            text-decoration: none; margin-bottom: 20px;
            transition: color .2s;
        }
        .bd-hero-back:hover { color: #FC8900; }
        .bd-hero-back i { font-size: 11px; }
        .bd-hero-pill {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
            font-size: 11px; font-weight: 700; letter-spacing: .4px;
        }
        .bd-pill-tesis              { background: rgba(255,255,255,.12); color: #fff; border: 1px solid rgba(255,255,255,.2); }
        .bd-pill-monografia         { background: rgba(161,89,255,.2);   color: #d4aaff; border: 1px solid rgba(161,89,255,.3); }
        .bd-pill-revista            { background: rgba(16,185,129,.2);   color: #6ee7b7; border: 1px solid rgba(16,185,129,.3); }
        .bd-pill-revista-cientifica { background: rgba(252,137,0,.18);   color: #FC8900; border: 1px solid rgba(252,137,0,.3); }
        .bd-hero-title {
            font-size: clamp(22px,3.5vw,38px); font-weight: 800;
            color: #fff; line-height: 1.25; margin-bottom: 16px;
            max-width: 720px;
        }
        .bd-hero-meta {
            display: flex; flex-wrap: wrap; gap: 18px;
        }
        .bd-hero-meta-item {
            display: flex; align-items: center; gap: 7px;
            color: rgba(255,255,255,.7); font-size: 13px;
        }
        .bd-hero-meta-item i { color: #FC8900; font-size: 12px; }

        .bd-section { background: #f2f5f8; padding: 40px 0 80px; }
        .bd-layout {
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 28px; align-items: start;
        }
        @media (max-width: 991px) { .bd-layout { grid-template-columns: 1fr; } }

        .bd-card {
            background: #fff; border-radius: 16px;
            border: 1px solid rgba(18,138,162,.07);
            box-shadow: 0 3px 18px rgba(18,138,162,.06);
            overflow: hidden; margin-bottom: 20px;
        }
        .bd-card:last-child { margin-bottom: 0; }
        .bd-card-header {
            display: flex; align-items: center; gap: 12px;
            padding: 18px 24px; border-bottom: 1px solid rgba(18,138,162,.07);
        }
        .bd-card-icon {
            width: 38px; height: 38px; border-radius: 10px;
            background: rgba(18,138,162,.07); color: #128AA2;
            display: flex; align-items: center; justify-content: center;
            font-size: 15px; flex-shrink: 0;
        }
        .bd-card-title {
            font-size: 15px; font-weight: 700; color: #128AA2; margin: 0;
        }
        .bd-card-body { padding: 20px 24px; }
        .bd-card-text {
            font-size: 14.5px; color: #555; line-height: 1.75; margin: 0;
        }

        .bd-ficha { display: flex; flex-direction: column; gap: 0; }
        .bd-ficha-row {
            display: flex; align-items: flex-start; gap: 14px;
            padding: 13px 0; border-bottom: 1px solid rgba(18,138,162,.06);
        }
        .bd-ficha-row:last-child { border-bottom: none; padding-bottom: 0; }
        .bd-ficha-row:first-child { padding-top: 0; }
        .bd-ficha-icon {
            width: 32px; height: 32px; border-radius: 8px;
            background: rgba(18,138,162,.06); color: #128AA2;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; flex-shrink: 0; margin-top: 2px;
        }
        .bd-ficha-content { flex: 1; min-width: 0; }
        .bd-ficha-label {
            font-size: 11px; font-weight: 700; color: rgba(18,138,162,.45);
            letter-spacing: .4px; text-transform: uppercase; margin-bottom: 3px;
        }
        .bd-ficha-value {
            font-size: 14px; font-weight: 600; color: #128AA2; line-height: 1.4;
        }

        .bd-tipo-badge {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 6px 14px; border-radius: 20px;
            font-size: 12px; font-weight: 700;
        }
        .bd-badge-tesis              { background: rgba(18,138,162,.1);   color: #128AA2; }
        .bd-badge-monografia         { background: rgba(91,43,138,.1); color: #5b2b8a; }
        .bd-badge-revista            { background: rgba(14,125,94,.1); color: #0e7d5e; }
        .bd-badge-revista-cientifica { background: rgba(201,75,0,.1);  color: #c94b00; }

        .bd-sidebar { display: flex; flex-direction: column; gap: 16px; }
        .bd-sidebar-sticky { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 16px; }
        @media (max-width: 991px) { .bd-sidebar-sticky { position: static; } }

        .bd-action-card {
            background: #fff; border-radius: 16px;
            border: 1px solid rgba(18,138,162,.07);
            box-shadow: 0 3px 18px rgba(18,138,162,.06);
            overflow: hidden;
        }
        .bd-action-head {
            padding: 16px 20px; border-bottom: 1px solid rgba(18,138,162,.07);
            display: flex; align-items: center; gap: 8px;
        }
        .bd-action-head i { color: #FC8900; font-size: 14px; }
        .bd-action-head span { font-size: 12px; font-weight: 700; color: #128AA2; letter-spacing: .4px; text-transform: uppercase; }
        .bd-action-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }

        .bd-btn-primary {
            display: flex; align-items: center; justify-content: center; gap: 9px;
            width: 100%; padding: 13px;
            background: #128AA2; color: #fff;
            border-radius: 12px; font-size: 14px; font-weight: 700;
            text-decoration: none; border: none; cursor: pointer;
            transition: background .2s, transform .15s;
        }
        .bd-btn-primary:hover { background: #055470; color: #fff; transform: translateY(-1px); }
        .bd-btn-primary i { font-size: 15px; }

        .bd-btn-secondary {
            display: flex; align-items: center; justify-content: center; gap: 9px;
            width: 100%; padding: 12px;
            background: transparent; color: #128AA2;
            border-radius: 12px; font-size: 14px; font-weight: 700;
            text-decoration: none; border: 1.5px solid rgba(18,138,162,.2); cursor: pointer;
            transition: all .2s;
        }
        .bd-btn-secondary:hover { background: rgba(18,138,162,.05); border-color: #128AA2; color: #128AA2; }

        .bd-btn-disabled {
            display: flex; align-items: center; justify-content: center; gap: 9px;
            width: 100%; padding: 13px;
            background: rgba(18,138,162,.06); color: rgba(18,138,162,.35);
            border-radius: 12px; font-size: 14px; font-weight: 700;
            border: 1.5px dashed rgba(18,138,162,.15); cursor: not-allowed;
        }
        .bd-share { display: flex; flex-direction: column; gap: 8px; }
        .bd-share-label { font-size: 12px; font-weight: 700; color: rgba(18,138,162,.45); letter-spacing: .4px; text-transform: uppercase; }
        .bd-share-btns { display: flex; gap: 8px; }
        .bd-share-btn {
            width: 38px; height: 38px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 15px; text-decoration: none; transition: transform .2s, opacity .2s;
            flex-shrink: 0;
        }
        .bd-share-btn:hover { transform: translateY(-2px); opacity: .85; }
        .bd-share-fb  { background: #1877f2; color: #fff; }
        .bd-share-wa  { background: #25d366; color: #fff; }
        .bd-share-li  { background: #0a66c2; color: #fff; }

        .bd-skel-hero { min-height: 280px; background: #128AA2; }
        .bd-skel-bar { height: 16px; border-radius: 8px; background: rgba(255,255,255,.12); margin-bottom: 12px; animation: bd-pulse 1.4s ease-in-out infinite; }
        .bd-skel-bar.w60 { width: 60%; }
        .bd-skel-bar.w80 { width: 80%; }
        .bd-skel-bar.w40 { width: 40%; }
        .bd-skel-block { height: 160px; border-radius: 12px; background: #e8eef2; margin-bottom: 20px; animation: bd-pulse 1.4s ease-in-out infinite; }
        @keyframes bd-pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

        .bd-not-found {
            text-align: center; padding: 80px 24px;
            background: #fff; border-radius: 16px;
        }
        .bd-not-found i { font-size: 52px; color: rgba(18,138,162,.2); margin-bottom: 20px; display: block; }
        .bd-not-found h3 { font-size: 20px; font-weight: 700; color: #128AA2; margin-bottom: 8px; }
        .bd-not-found p { color: rgba(18,138,162,.55); font-size: 14px; margin-bottom: 24px; }
        .bd-not-found a {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 11px 24px; background: #128AA2; color: #fff;
            border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none;
        }

        @media (max-width: 576px) {
            .bd-card-body { padding: 16px; }
            .bd-card-header { padding: 14px 16px; }
        }
    `],
})
export class BibliotecaDetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private svc = inject(PublicacionService);
    private cdr = inject(ChangeDetectorRef);
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    pub: Publicacion | null = null;
    cargando = true;
    noEncontrado = false;
    pageUrl = '';
    private sub: Subscription | null = null;

    ngOnInit(): void {
        this.sub = this.route.paramMap.pipe(
            switchMap(params => {
                if (this.isBrowser) this.pageUrl = window.location.href;
                this.pub = null;
                this.noEncontrado = false;
                this.cargando = true;
                this.cdr.detectChanges();
                const tipo = params.get('tipo') ?? '';
                const slug = params.get('slug') ?? '';
                return this.svc.getBySlug(tipo, slug);
            })
        ).subscribe({
            next: p => {
                this.pub = p;
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.noEncontrado = true;
                this.cargando = false;
                this.cdr.detectChanges();
            },
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    getTipoPillClass(tipo: string): string {
        return { 'tesis': 'bd-pill-tesis', 'monografia': 'bd-pill-monografia', 'revista': 'bd-pill-revista', 'revista-cientifica': 'bd-pill-revista-cientifica' }[tipo] ?? 'bd-pill-tesis';
    }

    getTipoBadgeClass(tipo: string): string {
        return { 'tesis': 'bd-badge-tesis', 'monografia': 'bd-badge-monografia', 'revista': 'bd-badge-revista', 'revista-cientifica': 'bd-badge-revista-cientifica' }[tipo] ?? 'bd-badge-tesis';
    }

    getTipoIcon(tipo: string): string {
        return { 'tesis': 'fa-solid fa-graduation-cap', 'monografia': 'fa-solid fa-book-open', 'revista': 'fa-solid fa-newspaper', 'revista-cientifica': 'fa-solid fa-flask' }[tipo] ?? 'fa-solid fa-book';
    }

    shareUrl(red: 'facebook' | 'whatsapp' | 'linkedin'): string {
        const url = encodeURIComponent(this.pageUrl);
        const titulo = encodeURIComponent(this.pub?.titulo ?? '');
        if (red === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        if (red === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        return `https://wa.me/?text=${titulo}%20${url}`;
    }
}
