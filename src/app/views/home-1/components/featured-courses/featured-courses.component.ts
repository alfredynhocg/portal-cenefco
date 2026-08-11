import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CursoService } from '../../../../cursos/application/services/curso.service';
import { Curso } from '../../../../cursos/domain/models/curso.model';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';

@Component({
    selector: 'app-featured-courses',
    imports: [CommonModule, RouterLink, DatePipe, TruncatePipe],
    templateUrl: './featured-courses.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .cs-section {
            background: #f4f7f9;
            position: relative;
            overflow: hidden;
            padding: 88px 0 80px;
        }

        .cs-bg-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            opacity: 0.06;
            pointer-events: none;
        }
        .cs-bg-blob--1 { width: 500px; height: 500px; background: #128AA2; top: -100px; left: -80px; }
        .cs-bg-blob--2 { width: 400px; height: 400px; background: #FC8900; bottom: -80px; right: -60px; }

        .cs-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(18,138,162,0.08);
            color: #128AA2;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.4px;
            padding: 6px 16px;
            border-radius: 20px;
            border: 1px solid rgba(18,138,162,0.15);
            margin-bottom: 16px;
        }
        .cs-badge i { color: #FC8900; }

        .cs-title {
            font-size: clamp(26px, 3.5vw, 38px);
            font-weight: 800;
            color: #128AA2;
            line-height: 1.2;
            margin-bottom: 14px;
        }
        .cs-title span { color: #FC8900; }
        .cs-subtitle {
            font-size: 15px;
            color: #666;
            line-height: 1.7;
        }

        .cs-card {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            border: 1.5px solid rgba(18,138,162,0.07);
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
            text-decoration: none;
        }
        .cs-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 24px 48px rgba(18,138,162,0.13);
            border-color: rgba(18,138,162,0.13);
        }

        .cs-card-top {
            position: relative;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
        }
        .cs-card-top::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
        }

        .cs-card-img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .5s ease;
        }
        .cs-card:hover .cs-card-img { transform: scale(1.06); }
        .cs-card-img-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(160deg, rgba(18,138,162,0.55) 0%, rgba(18,138,162,0.75) 100%);
            z-index: 1;
        }

        .cs-card-num {
            position: absolute;
            right: 12px;
            bottom: -8px;
            font-size: 80px;
            font-weight: 900;
            color: rgba(255,255,255,0.10);
            line-height: 1;
            user-select: none;
            z-index: 2;
        }

        .cs-card-icon-wrap {
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.22);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            color: #fff;
            position: relative;
            z-index: 2;
            backdrop-filter: blur(4px);
            border: 1.5px solid rgba(255,255,255,0.25);
            transition: transform .3s ease;
        }
        .cs-card:hover .cs-card-icon-wrap { transform: scale(1.1) rotate(-5deg); }

        .cs-card-badges {
            position: absolute;
            top: 12px;
            left: 14px;
            z-index: 3;
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .cs-card-badge {
            font-size: 10px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 20px;
            letter-spacing: 0.3px;
            backdrop-filter: blur(4px);
        }
        .cs-card-badge--tipo {
            background: rgba(255,255,255,0.25);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .cs-card-badge--area {
            background: #FC8900;
            color: #fff;
        }

        .cs-card-body {
            padding: 22px 22px 0;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .cs-card-title {
            font-size: 15.5px;
            font-weight: 800;
            color: #128AA2;
            line-height: 1.35;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color .2s;
        }
        .cs-card:hover .cs-card-title { color: #FC8900; }

        .cs-card-desc {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.65;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .cs-card-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 14px 0 0;
        }
        .cs-meta-pill {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11.5px;
            font-weight: 600;
            color: #128AA2;
            background: rgba(18,138,162,0.07);
            border-radius: 20px;
            padding: 4px 10px;
        }
        .cs-meta-pill i { font-size: 10px; color: #FC8900; }

        .cs-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 22px 18px;
            margin-top: 14px;
            border-top: 1px solid rgba(18,138,162,0.07);
        }
        .cs-card-price {
            display: flex;
            flex-direction: column;
        }
        .cs-card-price-label {
            font-size: 10px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .cs-card-price-value {
            font-size: 18px;
            font-weight: 900;
            color: #128AA2;
            line-height: 1;
        }
        .cs-card-price-value span { font-size: 12px; font-weight: 600; color: #9ca3af; }
        .cs-card-price-cuotas {
            font-size: 11px;
            color: #9ca3af;
            margin-top: 2px;
        }

        .cs-card-link {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            background: #128AA2;
            border-radius: 10px;
            padding: 10px 18px;
            text-decoration: none;
            transition: all .25s ease;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .cs-card-link:hover {
            background: #FC8900;
            transform: translateX(3px);
        }
        .cs-card-link i { font-size: 11px; }

        .cs-carousel-wrap { position: relative; }

        .cs-scroll-track {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 12px 4px 20px;
            scrollbar-width: none;
        }
        .cs-scroll-track::-webkit-scrollbar { display: none; }

        .cs-scroll-track .cs-card {
            flex: 0 0 calc(33.333% - 14px);
            min-width: 280px;
            scroll-snap-align: start;
        }

        .cs-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-60%);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #fff;
            border: 1.5px solid rgba(18,138,162,0.15);
            color: #128AA2;
            font-size: 15px;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(18,138,162,0.12);
            transition: all .25s ease;
        }
        .cs-nav:hover {
            background: #FC8900;
            border-color: #FC8900;
            color: #fff;
            transform: translateY(-60%) scale(1.08);
        }
        .cs-nav-prev { left: -24px; }
        .cs-nav-next { right: -24px; }

        @media (max-width: 1199px) {
            .cs-scroll-track .cs-card { flex: 0 0 calc(50% - 10px); }
        }
        @media (max-width: 767px) {
            .cs-section { padding: 64px 0 56px; }
            .cs-scroll-track .cs-card { flex: 0 0 80vw; }
            .cs-nav { display: none; }
        }
        @media (max-width: 480px) {
            .cs-card-footer { flex-direction: column; align-items: flex-start; gap: 12px; }
            .cs-card-link { width: 100%; justify-content: center; }
        }

        /* Dots — solo visibles en móvil/tablet */
        .cs-dots { display: none; }
        @media (max-width: 1199px) {
            .cs-dots {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                margin-top: 20px;
            }
            .cs-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(18,138,162,0.20);
                border: none;
                cursor: pointer;
                padding: 0;
                transition: all 0.25s ease;
                flex-shrink: 0;
            }
            .cs-dot-active {
                background: #FC8900;
                width: 24px;
                border-radius: 4px;
            }
        }
    `]
})
export class FeaturedCoursesComponent implements OnInit, OnDestroy {

    private cursoService = inject(CursoService);
    private cdr = inject(ChangeDetectorRef);
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    @ViewChild('scrollTrack') scrollTrack!: ElementRef<HTMLDivElement>;

    cursos: Curso[] = [];
    cargando  = true;
    dotActivo = signal(0);

    private autoPlayTimer?: ReturnType<typeof setInterval>;
    private pauseTimer?:    ReturnType<typeof setTimeout>;
    private readonly INTERVAL = 3500;

    ngOnInit(): void {
        this.cursoService.getAll(30).subscribe({
            next: (res) => {
                this.cursos = res.data;
                this.cargando = false;
                this.cdr.detectChanges();
                if (this.isBrowser) setTimeout(() => this.iniciarAutoPlay(), 0);
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.detenerAutoPlay();
    }

    private iniciarAutoPlay(): void {
        this.detenerAutoPlay();
        this.autoPlayTimer = setInterval(() => this.avanzarSiguiente(), this.INTERVAL);
    }

    private detenerAutoPlay(): void {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
        if (this.pauseTimer)    clearTimeout(this.pauseTimer);
    }

    private avanzarSiguiente(): void {
        if (!this.cursos.length || !this.scrollTrack) return;
        const siguiente = (this.dotActivo() + 1) % this.cursos.length;
        this.irADot(siguiente);
    }

    private pausarYReanudar(): void {
        this.detenerAutoPlay();
        this.pauseTimer = setTimeout(() => this.iniciarAutoPlay(), 6000);
    }

    scrollPrev(): void {
        this.pausarYReanudar();
        this.scrollTrack.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
    }

    scrollNext(): void {
        this.pausarYReanudar();
        this.scrollTrack.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
    }

    irADot(index: number): void {
        const track = this.scrollTrack.nativeElement;
        const card  = track.children[index] as HTMLElement;
        if (card) {
            track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
        this.dotActivo.set(index);
    }

    onScroll(): void {
        const track = this.scrollTrack.nativeElement;
        const cardW = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
        const index = Math.round(track.scrollLeft / cardW);
        this.dotActivo.set(Math.min(index, this.cursos.length - 1));
        this.cdr.detectChanges();
    }

    onTouchStart(): void {
        this.pausarYReanudar();
    }

    colorCard(curso: Curso): string {
        return curso.area_color ?? '#128AA2';
    }

    precio(curso: Curso): string | null {
        const v = curso.plan_costo ?? Number(curso.inversion ?? 0);
        return v > 0 ? `Bs. ${v.toLocaleString('es-BO')}` : null;
    }
}
