import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AreaPortalService } from '../../areas/application/services/area.service';
import { Area, AreaCurso } from '../../areas/domain/models/area.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';

@Component({
    selector: 'app-area-detail',
    imports: [CommonModule, RouterLink, BreadcrumbComponent, ImageUrlPipe, TruncatePipe],
    providers: [ImageUrlPipe],
    templateUrl: './area-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .ad-hero {
            position: relative;
            overflow: hidden;
            background: #128AA2;
        }
        .ad-hero-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.18;
        }
        .ad-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(160deg, rgba(18,138,162,0.55) 0%, rgba(18,138,162,0.92) 100%);
        }
        .ad-hero-body {
            position: relative;
            z-index: 1;
            padding: 120px 0 56px;
            width: 100%;
        }
        .ad-hero-inner {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 40px;
        }
        .ad-hero-logo {
            width: 180px;
            height: 110px;
            object-fit: contain;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.92);
            border-radius: 16px;
            padding: 14px 18px;
            backdrop-filter: blur(4px);
        }
        .ad-hero-icon {
            width: 80px;
            height: 80px;
            border-radius: 18px;
            background: rgba(255,255,255,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            color: #fff;
            flex-shrink: 0;
        }
        .ad-hero-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .ad-hero-text h1 {
            font-size: clamp(26px, 3.5vw, 44px);
            font-weight: 800;
            color: #fff;
            line-height: 1.15;
            margin: 0 0 12px;
        }
        .ad-hero-text p {
            font-size: 0.95rem;
            color: rgba(255,255,255,0.85);
            margin: 0;
            line-height: 1.7;
            max-width: 640px;
            text-align: justify;
        }
        .ad-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.12);
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 4px 14px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
            margin-bottom: 12px;
        }
        .ad-hero-badge i { color: #FC8900; }

        .ad-galeria {
            background: #fff;
            border-bottom: 1px solid #f0f2f5;
            padding: 20px 0;
            overflow: hidden;
        }
        .ad-galeria-track-wrap { overflow: hidden; width: 100%; }
        .ad-galeria-track {
            display: flex;
            gap: 14px;
            width: max-content;
            animation: galeriaScroll 28s linear infinite;
        }
        .ad-galeria-track:hover { animation-play-state: paused; }
        .ad-galeria-img {
            height: 120px;
            width: 180px;
            object-fit: cover;
            border-radius: 12px;
            flex-shrink: 0;
            cursor: pointer;
            transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .ad-galeria-img:hover { transform: scale(1.05); opacity: 0.9; }
        @keyframes galeriaScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
        }

        .ad-lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.88);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: lbFadeIn 0.2s ease;
            cursor: zoom-out;
        }
        .ad-lightbox img {
            max-width: 90vw;
            max-height: 88vh;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 24px 80px rgba(0,0,0,0.6);
            animation: lbScaleIn 0.25s ease;
            cursor: default;
        }
        .ad-lightbox-close {
            position: absolute;
            top: 20px; right: 24px;
            background: rgba(255,255,255,0.15);
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px; height: 40px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .ad-lightbox-close:hover { background: rgba(255,255,255,0.3); }
        @keyframes lbFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbScaleIn { from { transform: scale(0.9); } to { transform: scale(1); } }

        .ad-section { background: #f4f7f9; padding: 56px 0 80px; }

        .ad-section-header { margin-bottom: 24px; }
        .ad-section-header h2 {
            font-size: clamp(20px, 2.5vw, 28px);
            font-weight: 800;
            color: #128AA2;
            margin: 0 0 6px;
        }
        .ad-section-header p {
            font-size: 0.88rem;
            color: #9ca3af;
            margin: 0;
        }

        .ad-search-wrap {
            position: relative;
            max-width: 480px;
            margin-bottom: 32px;
        }
        .ad-search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #128AA2;
            font-size: 14px;
            pointer-events: none;
        }
        .ad-search-input {
            width: 100%;
            padding: 13px 44px 13px 44px;
            border: 1.5px solid rgba(18,138,162,0.15);
            border-radius: 12px;
            font-size: 14px;
            color: #333;
            background: #fff;
            outline: none;
            box-shadow: 0 3px 14px rgba(18,138,162,0.07);
            transition: border-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
            font-family: inherit;
        }
        .ad-search-input:focus {
            border-color: #128AA2;
            box-shadow: 0 0 0 3px rgba(18,138,162,0.08);
        }
        .ad-search-clear {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #aaa;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 0 4px;
        }
        .ad-search-clear:hover { color: #128AA2; }

        .ad-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
        }
        .ad-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            display: flex;
            flex-direction: column;
            height: 100%;
            text-decoration: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .ad-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(18,138,162,0.13);
        }
        .ad-card-img {
            position: relative;
            height: 190px;
            overflow: hidden;
            background: #e8edf2;
        }
        .ad-card-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
        }
        .ad-card:hover .ad-card-img img { transform: scale(1.05); }
        .ad-card-img-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(0deg, rgba(18,138,162,0.55) 0%, transparent 60%);
        }
        .ad-card-tag {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #FC8900;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .ad-card-body {
            padding: 18px 20px 12px;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .ad-card-title {
            font-size: 0.97rem;
            font-weight: 700;
            color: #128AA2;
            line-height: 1.3;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .ad-card-desc {
            font-size: 0.83rem;
            color: #6b7280;
            line-height: 1.55;
            margin: 0;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .ad-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            border-top: 1px solid #f0f2f5;
        }
        .ad-card-meta {
            font-size: 0.78rem;
            color: #9ca3af;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .ad-card-btn {
            font-size: 0.8rem;
            font-weight: 700;
            color: #128AA2;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: color 0.2s;
        }
        .ad-card:hover .ad-card-btn { color: #FC8900; }

        .ad-skeleton {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
        }
        .ad-skel-img  { height: 190px; background: #e8edf2; }
        .ad-skel-body { padding: 18px 20px; }
        .ad-skel-line { height: 11px; background: #e8edf2; border-radius: 6px; margin-bottom: 10px; animation: adPulse 1.5s ease-in-out infinite; }
        .ad-skel-line.short { width: 50%; }

        @keyframes adPulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
        }

        .ad-empty { text-align: center; padding: 60px 24px; color: #bbb; }
        .ad-empty i { font-size: 48px; display: block; margin-bottom: 16px; color: #dde4e8; }
        .ad-back {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #128AA2;
            font-size: 0.88rem;
            font-weight: 600;
            margin-bottom: 32px;
            text-decoration: none;
            opacity: 0.75;
            transition: opacity 0.2s;
        }
        .ad-back:hover { opacity: 1; }

        @media (max-width: 767px) {
            .ad-grid { grid-template-columns: 1fr; }
            .ad-hero-body { padding: 110px 0 40px; }
            .ad-hero-inner { flex-direction: column; align-items: flex-start; gap: 14px; }
            .ad-hero-logo { width: 140px; height: 86px; padding: 10px 14px; border-radius: 12px; }
        }
    `]
})
export class AreaDetailComponent implements OnInit, OnDestroy {
    private service  = inject(AreaPortalService);
    private route    = inject(ActivatedRoute);
    private cdr      = inject(ChangeDetectorRef);
    private imageUrl = inject(ImageUrlPipe);
    private document = inject<Document>(DOCUMENT);

    area        : Area | null = null;
    cursos      : AreaCurso[] = [];
    cargando     = true;
    lightboxImg  : string | null = null;
    galeriaLoop  : string[] = [];
    busqueda     = '';
    private sub: Subscription | null = null;

    get cursosFiltrados(): AreaCurso[] {
        if (!this.busqueda.trim()) return this.cursos;
        const q = this.busqueda.trim().toLowerCase();
        return this.cursos.filter(c =>
            c.nombre_programa.toLowerCase().includes(q) ||
            (c.descripcion ?? '').toLowerCase().includes(q)
        );
    }

    onBusqueda(e: Event): void {
        this.busqueda = (e.target as HTMLInputElement).value;
        this.cdr.detectChanges();
    }

    limpiarBusqueda(): void {
        this.busqueda = '';
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.sub = this.route.paramMap.pipe(
            switchMap(params => {
                this.cargando = true;
                this.area = null;
                this.cursos = [];
                this.galeriaLoop = [];
                this.busqueda = '';
                this.cdr.detectChanges();
                return this.service.getBySlug(params.get('slug') ?? '');
            })
        ).subscribe({
            next: res => {
                this.area   = res.area;
                this.cursos = res.cursos;
                const imgs = (res.area.galeria ?? [])
                    .map((u: string) => this.imageUrl.transform(u)!)
                    .filter(Boolean);
                this.galeriaLoop = [...imgs, ...imgs];
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    abrirLightbox(url: string): void {
        this.lightboxImg = url;
        this.document.body.style.overflow = 'hidden';
        this.cdr.detectChanges();
    }

    cerrarLightbox(): void {
        this.lightboxImg = null;
        this.document.body.style.overflow = '';
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        this.document.body.style.overflow = '';
        this.sub?.unsubscribe();
    }

}
