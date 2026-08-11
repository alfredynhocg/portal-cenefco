import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, type OwlOptions } from 'ngx-owl-carousel-o';
import { BannerService } from '../../../../banners/application/services/banner.service';
import { Banner } from '../../../../banners/domain/models/banner.model';

@Component({
    selector: 'app-hero',
    imports: [NgTemplateOutlet, RouterLink, CarouselModule],
    templateUrl: './hero.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .hero1-section-area .hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                105deg,
                rgba(18,138,162,0.82) 0%,
                rgba(18,138,162,0.55) 55%,
                rgba(0,0,0,0.15) 100%
            );
            z-index: 1;
        }

        .hero-stats-row {
            display: flex !important;
            align-items: center;
            gap: 0;
            background: none !important;
            padding: 0 !important;
            border: none !important;
            margin-top: 36px;
        }
        .hero-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 22px;
        }
        .hero-stat-item:first-child { padding-left: 0; }
        .hero-stat-num {
            font-size: 26px;
            font-weight: 800;
            color: #FC8900;
            line-height: 1;
            letter-spacing: -0.5px;
        }
        .hero-stat-label {
            font-size: 11px;
            color: rgba(255,255,255,0.7);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 4px;
        }
        .hero-stat-sep {
            width: 1px;
            height: 36px;
            background: rgba(255,255,255,0.2);
        }

        .slider-header-carousel .owl-nav {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            pointer-events: none;
        }
        .slider-header-carousel .owl-nav .owl-prev,
        .slider-header-carousel .owl-nav .owl-next {
            pointer-events: all;
            position: absolute;
            display: flex !important;
            align-items: center;
            justify-content: center;
            height: 64px !important;
            width: 64px !important;
            border-radius: 14px !important;
            outline: none;
            transition: all .3s ease;
            background: rgba(255, 248, 220, 0.95) !important;
            backdrop-filter: blur(6px);
            border: none !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.22);
        }
        .slider-header-carousel .owl-nav .owl-prev {
            left: 28px;
        }
        .slider-header-carousel .owl-nav .owl-next {
            right: 28px;
        }
        .slider-header-carousel .owl-nav .owl-prev:hover,
        .slider-header-carousel .owl-nav .owl-next:hover {
            background: #FC8900 !important;
            box-shadow: 0 6px 24px rgba(252,137,0,0.40);
            transform: scale(1.06);
        }
        .slider-header-carousel .owl-nav .owl-prev i,
        .slider-header-carousel .owl-nav .owl-next i {
            color: #128AA2;
            font-size: 22px !important;
        }
        .slider-header-carousel .owl-nav .owl-prev:hover i,
        .slider-header-carousel .owl-nav .owl-next:hover i {
            color: #fff;
        }

        .hero1-section-area .btn-area .header-btn1,
        .hero1-section-area .btn-area .header-btn2 {
            border-radius: 10px;
            padding: 14px 28px;
            font-size: 15px;
            letter-spacing: 0.2px;
        }
        .hero1-section-area .btn-area .header-btn1 {
            background: #FC8900;
            border: none;
        }
        .hero1-section-area .btn-area .header-btn1:hover {
            background: #e07a00;
        }
        .hero1-section-area .btn-area .header-btn2 {
            background: rgba(255,255,255,0.10);
            border: 1.5px solid rgba(255,255,255,0.50);
            backdrop-filter: blur(6px);
            color: #fff;
        }
        .hero1-section-area .btn-area .header-btn2:hover {
            background: rgba(255,255,255,0.22);
            border-color: rgba(255,255,255,0.70);
        }
        .hero1-section-area .btn-area .header-btn1 i,
        .hero1-section-area .btn-area .header-btn2 i {
            transform: rotate(-45deg);
        }
    `]
})
export class HeroComponent implements OnInit {

    private bannerService = inject(BannerService);
    private cdr = inject(ChangeDetectorRef);

    slides: Banner[] = [];

    carouselOptions: OwlOptions = {
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        mouseDrag: false,
        items: 1,
        autoplay: true,
        navText: ["<i class='fa-solid fa-angle-left'></i>", "<i class='fa-solid fa-angle-right'></i>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 2000,
        autoplayTimeout: 4000,
        autoplayHoverPause: false,
        responsive: {
            0: { items: 1, nav: true },
            600: { items: 1 },
            1000: { items: 1 }
        }
    };

    ngOnInit(): void {
        this.bannerService.getActivos().subscribe({
            next: (res) => {
                this.slides = res.data.filter(b => b.activo);
                this.cdr.detectChanges();
            },
            error: () => {  }
        });
    }

    esUrlExterna(url: string | null): boolean {
        return !!url && /^https?:\/\//i.test(url);
    }
}
