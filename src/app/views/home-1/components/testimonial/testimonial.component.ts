import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TestimonioService, Testimonio } from '../../../../testimonios/testimonio.service';
import { testimonialData } from '../data';

@Component({
    selector: 'app-testimonial',
    imports: [CarouselModule, CommonModule, RouterLink],
    templateUrl: './testimonial.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .ct-section {
            background: linear-gradient(160deg, #128AA2 0%, #0a5573 55%, #0d6b8f 100%);
            position: relative;
            overflow: hidden;
            padding: 88px 0 80px;
        }

        .ct-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
        }

        .ct-blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            pointer-events: none;
        }
        .ct-blob--1 { width: 480px; height: 480px; background: rgba(252,137,0,0.18); top: -120px; right: -80px; }
        .ct-blob--2 { width: 360px; height: 360px; background: rgba(255,255,255,0.06); bottom: -80px; left: -60px; }

        .ct-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(255,255,255,0.12);
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.4px;
            padding: 6px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.20);
            margin-bottom: 16px;
        }
        .ct-badge i { color: #FC8900; }

        .ct-title {
            font-size: clamp(26px, 3.5vw, 40px);
            font-weight: 800;
            color: #fff;
            line-height: 1.2;
            margin-bottom: 14px;
        }
        .ct-title span { color: #FC8900; }

        .ct-subtitle {
            font-size: 15px;
            color: rgba(255,255,255,0.70);
            line-height: 1.7;
            max-width: 520px;
            margin: 0 auto;
        }

        .ct-rating-summary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(255,255,255,0.10);
            border: 1px solid rgba(255,255,255,0.18);
            border-radius: 40px;
            padding: 8px 20px;
            margin-top: 20px;
        }
        .ct-rating-stars { display: flex; gap: 3px; }
        .ct-rating-stars i { color: #FC8900; font-size: 13px; }
        .ct-rating-text {
            font-size: 13px;
            font-weight: 600;
            color: rgba(255,255,255,0.85);
        }
        .ct-rating-text strong { color: #fff; }

        .ct-carousel-wrap { position: relative; padding: 0 4px; }

        .ct-carousel .owl-stage-outer { padding: 16px 4px 8px; overflow: visible !important; }
        .ct-carousel .owl-stage { display: flex !important; flex-wrap: nowrap !important; align-items: stretch !important; }
        .ct-carousel .owl-item { display: flex !important; flex-direction: column; flex-shrink: 0; }
        .ct-carousel .owl-item .ct-card { flex: 1; }

        .ct-carousel .owl-dots {
            display: flex !important;
            justify-content: center;
            gap: 8px;
            margin-top: 28px;
        }
        .ct-carousel .owl-dot {
            background: none !important;
            border: none !important;
            padding: 4px 2px !important;
            outline: none !important;
        }
        .ct-carousel .owl-dot span {
            display: block;
            height: 8px;
            width: 8px;
            background: rgba(255,255,255,0.25) !important;
            border-radius: 50%;
            transition: all .3s ease;
            margin: 0 !important;
        }
        .ct-carousel .owl-dot.active span {
            width: 28px;
            border-radius: 4px;
            background: #FC8900 !important;
        }

        .ct-carousel .owl-nav {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-60%);
            pointer-events: none;
            margin: 0 !important;
        }
        .ct-carousel .owl-prev,
        .ct-carousel .owl-next {
            pointer-events: all;
            position: absolute;
            display: flex !important;
            align-items: center;
            justify-content: center;
            height: 48px;
            width: 48px;
            border-radius: 50% !important;
            background: rgba(255,255,255,0.12) !important;
            border: 1.5px solid rgba(255,255,255,0.25) !important;
            color: #fff !important;
            font-size: 15px !important;
            backdrop-filter: blur(6px);
            transition: all .3s ease;
        }
        .ct-carousel .owl-prev { left: -20px; }
        .ct-carousel .owl-next { right: -20px; }
        .ct-carousel .owl-prev:hover,
        .ct-carousel .owl-next:hover {
            background: #FC8900 !important;
            border-color: #FC8900 !important;
            transform: scale(1.08);
        }
        .ct-carousel .owl-prev.disabled,
        .ct-carousel .owl-next.disabled { opacity: 0.3 !important; }

        .ct-card {
            background: #fff;
            border-radius: 20px;
            padding: 28px 26px 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            border: 1.5px solid rgba(255,255,255,0.10);
            display: flex;
            flex-direction: column;
            width: 100%;
            transition: transform .3s ease, box-shadow .3s ease;
            position: relative;
            overflow: hidden;
        }
        .ct-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, #128AA2, #FC8900);
            opacity: 0;
            transition: opacity .3s ease;
        }
        .ct-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 48px rgba(0,0,0,0.24);
        }
        .ct-card:hover::before { opacity: 1; }

        .ct-card-quote {
            position: absolute;
            top: 16px;
            right: 20px;
            font-size: 72px;
            line-height: 1;
            color: rgba(18,138,162,0.07);
            font-family: Georgia, serif;
            font-weight: 900;
            pointer-events: none;
            user-select: none;
        }

        .ct-stars {
            display: flex;
            gap: 3px;
            margin-bottom: 16px;
        }
        .ct-stars i { color: #FC8900; font-size: 13px; }
        .ct-stars i.ct-star-empty { color: #e5e7eb; }

        .ct-message {
            font-size: 14.5px;
            color: #374151;
            line-height: 1.75;
            flex: 1;
            font-style: italic;
            margin-bottom: 22px;
            position: relative;
            z-index: 1;
        }

        .ct-author {
            display: flex;
            align-items: center;
            gap: 13px;
            padding-top: 18px;
            border-top: 1px solid #f1f5f8;
            margin-top: auto;
        }

        .ct-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            flex-shrink: 0;
            overflow: hidden;
            border: 2.5px solid #128AA2;
            position: relative;
        }
        .ct-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
        }
        .ct-avatar-initial {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 800;
            color: #fff;
            background: linear-gradient(135deg, #128AA2, #0d6b8f);
        }

        .ct-author-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .ct-author-name {
            font-size: 14px;
            font-weight: 800;
            color: #128AA2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .ct-author-role {
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ct-cta {
            display: flex;
            justify-content: center;
            margin-top: 44px;
        }
        .ct-cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #FC8900;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            padding: 14px 32px;
            border-radius: 12px;
            text-decoration: none;
            border: 2px solid #FC8900;
            transition: all .3s ease;
        }
        .ct-cta-btn:hover {
            background: transparent;
            color: #FC8900;
            transform: translateY(-3px);
            box-shadow: 0 8px 28px rgba(252,137,0,0.30);
        }
        .ct-cta-btn i { font-size: 13px; transition: transform .3s; }
        .ct-cta-btn:hover i { transform: translateX(4px); }

        .ct-skel-card {
            background: rgba(255,255,255,0.10);
            border-radius: 20px;
            padding: 28px 26px 24px;
            border: 1.5px solid rgba(255,255,255,0.08);
        }
        .ct-skel-block {
            background: rgba(255,255,255,0.12);
            border-radius: 6px;
            animation: ctPulse 1.5s ease-in-out infinite;
        }
        .ct-skel-stars { width: 90px; height: 14px; margin-bottom: 16px; }
        .ct-skel-line { height: 12px; margin-bottom: 8px; }
        .ct-skel-line.w-full { width: 100%; }
        .ct-skel-line.w-80 { width: 80%; }
        .ct-skel-line.w-60 { width: 60%; }
        .ct-skel-author { display: flex; align-items: center; gap: 12px; margin-top: 22px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.08); }
        .ct-skel-avatar { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; background: rgba(255,255,255,0.12); animation: ctPulse 1.5s ease-in-out infinite; }
        .ct-skel-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        @keyframes ctPulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
        }

        @media (max-width: 767px) {
            .ct-section { padding: 64px 0 56px; }
            .ct-carousel .owl-nav { display: none !important; }
        }
    `]
})
export class TestimonialComponent implements OnInit {
    private testimonioService = inject(TestimonioService);
    private cdr = inject(ChangeDetectorRef);

    testimonials: {
        message: string;
        authorImg: string | null;
        name: string;
        role: string;
        calificacion: number;
        inicial: string;
    }[] = [];

    cargando = true;

    carouselOptions: OwlOptions = {
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        navText: [
            "<i class='fa-solid fa-arrow-left'></i>",
            "<i class='fa-solid fa-arrow-right'></i>",
        ],
        smartSpeed: 700,
        responsive: {
            0:   { items: 1, nav: false },
            576: { items: 2, nav: false },
            992: { items: 3, nav: true  },
        }
    };

    ngOnInit(): void {
        this.testimonioService.getAll(12).subscribe({
            next: (res) => {
                this.testimonials = (res.data && res.data.length > 0)
                    ? this.mapTestimonios(res.data)
                    : this.staticFallback();
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.testimonials = this.staticFallback();
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

    private mapTestimonios(data: Testimonio[]) {
        return data.map((t: Testimonio) => ({
            message: t.testimonio,
            authorImg: t.foto_url
                ? (t.foto_url.startsWith('http') || t.foto_url.startsWith('/storage')
                    ? t.foto_url
                    : `/storage/${t.foto_url}`)
                : null,
            name: t.nombre,
            role: [t.cargo, t.empresa].filter(Boolean).join(' — '),
            calificacion: t.calificacion ?? 5,
            inicial: t.nombre?.charAt(0)?.toUpperCase() ?? 'U',
        }));
    }

    private staticFallback() {
        return testimonialData.map(t => ({
            message: t.message ?? t.description ?? '',
            authorImg: (t.authorImg ?? t.image) || null,
            name: t.name,
            role: t.role,
            calificacion: t.rating ?? 5,
            inicial: t.name?.charAt(0)?.toUpperCase() ?? 'U',
        }));
    }

    getStars(cal: number): ('full' | 'empty')[] {
        return Array(5).fill(0).map((_, i) => i < cal ? 'full' : 'empty');
    }

    promedioCalificacion(): string {
        if (!this.testimonials.length) return '5.0';
        const sum = this.testimonials.reduce((a, t) => a + t.calificacion, 0);
        return (sum / this.testimonials.length).toFixed(1);
    }
}
