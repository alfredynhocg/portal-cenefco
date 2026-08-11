import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarouselModule, type OwlOptions } from 'ngx-owl-carousel-o';
import { FotoService } from '../../../../fotos/application/services/foto.service';
import { Foto } from '../../../../fotos/domain/models/foto.model';
import { GALERIA_FOTOS } from '../../../../core/constants/galeria-fotos';

@Component({
    selector: 'app-photo-gallery',
    imports: [CommonModule, CarouselModule, RouterLink],
    templateUrl: './photo-gallery.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .cg-section { background: #f4f7f9; }

        .cg-badge {
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
        .cg-badge i { color: #FC8900; }

        .cg-title {
            font-size: clamp(26px, 3.5vw, 38px);
            font-weight: 800;
            color: #128AA2;
            line-height: 1.2;
            margin-bottom: 14px;
        }
        .cg-subtitle {
            font-size: 15px;
            color: #666;
            line-height: 1.7;
        }

        .cg-card {
            background: #fff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(18,138,162,0.08);
            border: 1px solid rgba(18,138,162,0.07);
            cursor: pointer;
            transition: transform .3s ease, box-shadow .3s ease;
            margin: 8px 0 16px;
        }
        .cg-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 14px 36px rgba(18,138,162,0.14);
        }

        .cg-card-img {
            position: relative;
            height: 220px;
            overflow: hidden;
        }
        .cg-card-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .5s ease;
        }
        .cg-card:hover .cg-card-img img { transform: scale(1.07); }

        .cg-card-overlay {
            position: absolute;
            inset: 0;
            background: rgba(18,138,162,0);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background .3s ease;
        }
        .cg-card:hover .cg-card-overlay {
            background: rgba(18,138,162,0.55);
        }
        .cg-card-zoom {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #FC8900;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
            opacity: 0;
            transform: scale(0.7);
            transition: opacity .3s ease, transform .3s ease;
        }
        .cg-card:hover .cg-card-zoom {
            opacity: 1;
            transform: scale(1);
        }

        .cg-card-body {
            padding: 14px 16px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }
        .cg-card-title {
            font-size: 13.5px;
            font-weight: 600;
            color: #128AA2;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex: 1;
        }
        .cg-card-date {
            font-size: 11px;
            color: #999;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
        }
        .cg-card-date i { color: #FC8900; font-size: 10px; }

        .cg-carousel .owl-dots {
            display: flex !important;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
        }
        .cg-carousel .owl-dot {
            background: none !important;
            border: none !important;
            padding: 4px 2px !important;
            outline: none !important;
        }
        .cg-carousel .owl-dot span {
            display: block;
            height: 8px;
            width: 8px;
            background: rgba(18,138,162,0.20) !important;
            border-radius: 50%;
            transition: all .3s ease;
            margin: 0 !important;
        }
        .cg-carousel .owl-dot.active span {
            width: 28px;
            border-radius: 4px;
            background: #FC8900 !important;
        }

        .cg-carousel .owl-nav {
            position: absolute;
            top: 45%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            pointer-events: none;
        }
        .cg-carousel .owl-prev,
        .cg-carousel .owl-next {
            pointer-events: all;
            position: absolute;
            display: flex !important;
            align-items: center;
            justify-content: center;
            height: 44px !important;
            width: 44px !important;
            border-radius: 50% !important;
            background: #fff !important;
            border: 1.5px solid rgba(18,138,162,0.15) !important;
            color: #128AA2 !important;
            font-size: 15px !important;
            box-shadow: 0 4px 14px rgba(18,138,162,0.12);
            transition: all .3s ease;
        }
        .cg-carousel .owl-prev { left: -22px; }
        .cg-carousel .owl-next { right: -22px; }
        .cg-carousel .owl-prev:hover,
        .cg-carousel .owl-next:hover {
            background: #FC8900 !important;
            border-color: #FC8900 !important;
            color: #fff !important;
        }

        .cg-cta {
            display: flex;
            justify-content: center;
            margin-top: 32px;
        }
        .cg-cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #128AA2;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            transition: all .3s ease;
        }
        .cg-cta-btn:hover {
            background: #FC8900;
            color: #fff;
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(252,137,0,0.30);
        }
        .cg-cta-btn i { font-size: 13px; }

        .lb-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.92);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: lb-fade .2s ease;
        }
        @keyframes lb-fade { from { opacity:0 } to { opacity:1 } }
        .lb-box {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .lb-img-wrap img {
            max-width: 85vw;
            max-height: 72vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.6);
            animation: lb-zoom .2s ease;
        }
        @keyframes lb-zoom { from { transform: scale(.92); opacity:0 } to { transform: scale(1); opacity:1 } }
        .lb-close {
            position: absolute;
            top: -44px;
            right: 0;
            background: none;
            border: none;
            color: #fff;
            font-size: 28px;
            cursor: pointer;
            opacity: .8;
            transition: opacity .2s;
        }
        .lb-close:hover { opacity: 1; }
        .lb-arrow {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.12);
            border: none;
            color: #fff;
            font-size: 22px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            cursor: pointer;
            transition: background .2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lb-arrow:hover { background: rgba(252,137,0,0.70); }
        .lb-prev { left: 16px; }
        .lb-next { right: 16px; }
        .lb-caption { margin-top: 14px; text-align: center; color: #fff; }
        .lb-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .lb-desc { font-size: 13px; opacity: .75; margin-bottom: 6px; }
        .lb-counter { font-size: 12px; opacity: .5; }
    `]
})
export class PhotoGalleryComponent implements OnInit, OnDestroy {
    private fotoService = inject(FotoService);
    private cdr = inject(ChangeDetectorRef);
    private document = inject<Document>(DOCUMENT);

    fotos: Foto[] = [];
    loaded = false;

    lightboxFoto: Foto | null = null;
    lightboxIndex = 0;

    openLightbox(foto: Foto, index: number): void {
        this.lightboxFoto = foto;
        this.lightboxIndex = index;
        this.document.body.style.overflow = 'hidden';
    }

    closeLightbox(): void {
        this.lightboxFoto = null;
        this.document.body.style.overflow = '';
    }

    prevFoto(): void {
        this.lightboxIndex = (this.lightboxIndex - 1 + this.fotos.length) % this.fotos.length;
        this.lightboxFoto = this.fotos[this.lightboxIndex];
    }

    nextFoto(): void {
        this.lightboxIndex = (this.lightboxIndex + 1) % this.fotos.length;
        this.lightboxFoto = this.fotos[this.lightboxIndex];
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (!this.lightboxFoto) return;
        if (event.key === 'Escape') this.closeLightbox();
        if (event.key === 'ArrowLeft') this.prevFoto();
        if (event.key === 'ArrowRight') this.nextFoto();
    }

    readonly fallbackImgs = [
        'assets/img/all-images/team1.png',
        'assets/img/all-images/team2.png',
        'assets/img/all-images/team3.png',
        'assets/img/all-images/team4.png',
    ];

    carouselOptions: OwlOptions = {
        loop: true,
        margin: 24,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3500,
        smartSpeed: 700,
        navText: [
            '<i class="fa-solid fa-arrow-left"></i>',
            '<i class="fa-solid fa-arrow-right"></i>',
        ],
        responsive: {
            0:    { items: 1 },
            576:  { items: 2 },
            992:  { items: 3 },
            1200: { items: 4 },
        }
    };

    readonly galeriaFotos = GALERIA_FOTOS;

    ngOnInit(): void {
        this.fotoService.getRecientes(8).subscribe({
            next: (res) => {
                this.fotos = res.data.length > 0 ? res.data : this.fallbackList();
                this.loaded = true;
                this.cdr.detectChanges();
            },
            error: () => {
                this.fotos = this.fallbackList();
                this.loaded = true;
                this.cdr.detectChanges();
            }
        });
    }

    ngOnDestroy(): void {
        this.document.body.style.overflow = '';
    }

    private fallbackList(): Foto[] {
        return this.fallbackImgs.map((img, i) => ({
            id_foto: i + 1,
            num_foto: i + 1,
            titulo_foto: `Foto Institucional N° ${i + 1}`,
            descripcion_foto: null,
            foto: img,
            fecha_foto: null,
            estado: 1,
        }));
    }
}
