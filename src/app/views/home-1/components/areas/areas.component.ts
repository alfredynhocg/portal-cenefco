import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation, inject, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AreaPortalService } from '../../../../areas/application/services/area.service';
import { Area } from '../../../../areas/domain/models/area.model';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
    selector: 'app-areas',
    imports: [CommonModule, RouterLink, ImageUrlPipe],
    templateUrl: './areas.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .ha-section {
            background: linear-gradient(160deg, #128AA2 0%, #0a5573 60%, #0d6b8f 100%);
            padding: 88px 0 80px;
            position: relative;
            overflow: hidden;
        }
        .ha-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 10% 20%, rgba(252,137,0,0.10) 0%, transparent 50%),
                radial-gradient(circle at 90% 80%, rgba(255,255,255,0.05) 0%, transparent 50%);
            pointer-events: none;
        }

        .ha-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 48px;
        }
        .ha-header-left { flex: 1; }
        .ha-badge {
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
            border: 1px solid rgba(255,255,255,0.20);
            margin-bottom: 16px;
        }
        .ha-badge i { color: #FC8900; }
        .ha-title {
            font-size: clamp(26px, 3.5vw, 40px);
            font-weight: 800;
            color: #fff;
            line-height: 1.15;
            margin-bottom: 12px;
        }
        .ha-title span { color: #FC8900; }
        .ha-subtitle {
            font-size: 15px;
            color: rgba(255,255,255,0.70);
            line-height: 1.7;
            max-width: 480px;
        }
        .ha-header-cta {
            flex-shrink: 0;
        }
        .ha-header-cta a {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255,255,255,0.12);
            color: #fff;
            font-size: 14px;
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 10px;
            border: 1.5px solid rgba(255,255,255,0.25);
            text-decoration: none;
            transition: all 0.25s ease;
            white-space: nowrap;
        }
        .ha-header-cta a:hover {
            background: #FC8900;
            border-color: #FC8900;
            transform: translateY(-2px);
        }

        .ha-card {
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            text-decoration: none;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            margin: 8px 12px 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .ha-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 24px 56px rgba(0,0,0,0.28);
        }

        .ha-card-top {
            position: relative;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .ha-card-top::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        }
        .ha-card-num {
            position: absolute;
            right: 16px;
            bottom: -4px;
            font-size: 80px;
            font-weight: 900;
            color: rgba(255,255,255,0.12);
            line-height: 1;
            letter-spacing: -4px;
            user-select: none;
        }
        .ha-card-icon-wrap {
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.20);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            color: #fff;
            position: relative;
            z-index: 1;
            transition: transform 0.35s ease;
            backdrop-filter: blur(4px);
        }
        .ha-card:hover .ha-card-icon-wrap {
            transform: scale(1.12) rotate(-6deg);
        }
        .ha-card-logo-wrap {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0 24px;
        }
        .ha-card-logo {
            max-height: 64px;
            max-width: 160px;
            object-fit: contain;
            filter: brightness(0) invert(1);
            transition: transform 0.35s ease;
        }
        .ha-card:hover .ha-card-logo {
            transform: scale(1.08);
        }

        .ha-card-body {
            padding: 24px 24px 16px;
            height: 130px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            overflow: hidden;
        }
        .ha-card-title {
            font-size: 1.05rem;
            font-weight: 800;
            color: #128AA2;
            line-height: 1.3;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex-shrink: 0;
        }
        .ha-card-desc {
            font-size: 0.87rem;
            color: #6b7280;
            line-height: 1.65;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .ha-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 24px 16px;
        }
        .ha-card-count {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            color: #9ca3af;
            font-weight: 500;
        }
        .ha-card-count i { font-size: 11px; }
        .ha-card-count strong { color: #128AA2; font-weight: 700; }
        .ha-card-link {
            font-size: 0.82rem;
            font-weight: 700;
            color: #FC8900;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            transition: gap 0.2s;
        }
        .ha-card:hover .ha-card-link { gap: 8px; }

        .ha-carousel-wrap {
            position: relative;
        }

        .ha-scroll-track {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding: 8px 4px 16px;
            scrollbar-width: none;
        }
        .ha-scroll-track::-webkit-scrollbar { display: none; }

        .ha-scroll-track .ha-card {
            flex: 0 0 calc(25% - 15px);
            min-width: 240px;
            scroll-snap-align: start;
        }

        .ha-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-60%);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            border: 1.5px solid rgba(255,255,255,0.30);
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            backdrop-filter: blur(6px);
            transition: all 0.25s ease;
        }
        .ha-nav:hover {
            background: #FC8900;
            border-color: #FC8900;
            transform: translateY(-60%) scale(1.1);
        }
        .ha-nav-prev { left: -22px; }
        .ha-nav-next { right: -22px; }

        .ha-scroll-wrap {
            display: flex;
            gap: 20px;
            overflow: hidden;
            padding: 8px 4px 16px;
        }
        .ha-skeleton {
            flex: 0 0 calc(25% - 15px);
            min-width: 240px;
            background: rgba(255,255,255,0.10);
            border-radius: 20px;
            overflow: hidden;
        }
        .ha-skel-top  { height: 120px; background: rgba(255,255,255,0.08); }
        .ha-skel-body { padding: 24px; display: flex; flex-direction: column; gap: 10px; }
        .ha-skel-line { height: 12px; background: rgba(255,255,255,0.10); border-radius: 6px; animation: haPulse 1.5s ease-in-out infinite; }
        .ha-skel-line.short { width: 55%; }
        @keyframes haPulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
        }

        @media (max-width: 1199px) {
            .ha-scroll-track .ha-card { flex: 0 0 calc(33.333% - 14px); }
            .ha-skeleton { flex: 0 0 calc(33.333% - 14px); }
        }
        @media (max-width: 991px) {
            .ha-header { flex-direction: column; align-items: flex-start; }
            .ha-header-cta { align-self: flex-start; }
            .ha-scroll-track .ha-card { flex: 0 0 calc(50% - 10px); }
            .ha-skeleton { flex: 0 0 calc(50% - 10px); }
            .ha-nav { display: none; }
        }
        @media (max-width: 767px) {
            .ha-section { padding: 60px 0; }
            .ha-scroll-track .ha-card { flex: 0 0 80vw; }
            .ha-skeleton { flex: 0 0 80vw; }
        }
        @media (max-width: 480px) {
            .ha-section { padding: 48px 0; }
            .ha-card-top { height: 100px; }
            .ha-card-body { padding: 18px 18px 12px; }
            .ha-card-footer { padding: 10px 18px 14px; }
        }

        /* Dots — solo visibles en móvil */
        .ha-dots {
            display: none;
        }
        @media (max-width: 991px) {
            .ha-dots {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
                margin-top: 20px;
            }
            .ha-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255,255,255,0.30);
                border: none;
                cursor: pointer;
                padding: 0;
                transition: all 0.25s ease;
                flex-shrink: 0;
            }
            .ha-dot-active {
                background: #FC8900;
                width: 24px;
                border-radius: 4px;
            }
        }
    `]
})
export class AreasHomeComponent implements OnInit, OnDestroy {
    private service   = inject(AreaPortalService);
    private cdr       = inject(ChangeDetectorRef);
    private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    @ViewChild('scrollTrack') scrollTrack!: ElementRef<HTMLDivElement>;

    areas    : Area[] = [];
    cargando  = true;
    dotActivo = signal(0);

    private autoPlayTimer?: ReturnType<typeof setInterval>;
    private pauseTimer?:    ReturnType<typeof setTimeout>;
    private readonly INTERVAL = 3500;

    ngOnInit(): void {
        this.service.getAll().subscribe({
            next: data => {
                this.areas   = data.filter(a => a.activo);
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
        if (!this.areas.length || !this.scrollTrack) return;
        const siguiente = (this.dotActivo() + 1) % this.areas.length;
        this.irADot(siguiente);
    }

    colorArea(area: Area): string {
        return area.color ?? '#128AA2';
    }

    scrollPrev(): void {
        this.pausarYReanudar();
        this.scrollTrack.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }

    scrollNext(): void {
        this.pausarYReanudar();
        this.scrollTrack.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
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
        this.dotActivo.set(Math.min(index, this.areas.length - 1));
        this.cdr.detectChanges();
    }

    onTouchStart(): void {
        this.pausarYReanudar();
    }

    private pausarYReanudar(): void {
        this.detenerAutoPlay();
        this.pauseTimer = setTimeout(() => this.iniciarAutoPlay(), 6000);
    }
}
