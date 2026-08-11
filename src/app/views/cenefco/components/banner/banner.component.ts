import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselModule, type OwlOptions } from 'ngx-owl-carousel-o';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BannerService } from '../../../../banners/application/services/banner.service';
import { Banner } from '../../../../banners/domain/models/banner.model';
import { BANNER } from '../../../../core/constants/banner.constants';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
    selector: 'app-banner',
    imports: [CarouselModule, RouterLink, SlickCarouselModule, CommonModule, ImageUrlPipe],
    templateUrl: './banner.component.html',
    styles: [`
        ::ng-deep .slider-header-carousel .owl-stage-outer,
        ::ng-deep .slider-header-carousel .owl-stage,
        ::ng-deep .slider-header-carousel .owl-item,
        ::ng-deep .slider-header-carousel .owl-item > div,
        ::ng-deep .slider-header-carousel .hero1-section-area {
            min-height: 820px !important;
            height: 820px !important;
        }
        @media (max-width: 991px) {
            ::ng-deep .slider-header-carousel .owl-stage-outer,
            ::ng-deep .slider-header-carousel .owl-stage,
            ::ng-deep .slider-header-carousel .owl-item,
            ::ng-deep .slider-header-carousel .owl-item > div,
            ::ng-deep .slider-header-carousel .hero1-section-area {
                min-height: 100svh !important;
                height: 100svh !important;
            }
        }
        ::ng-deep .slider-header-carousel .owl-stage {
            transition: none !important;
        }

        ::ng-deep .hero2-images-area .images img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 8px;
        }
        ::ng-deep .hero2-images-area .slick-slider {
            overflow: hidden;
        }
        ::ng-deep .hero2-images-area .slick-list {
            overflow: visible;
        }

        ::ng-deep .slider-header-carousel .owl-nav {
            position: absolute !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            left: 0 !important;
            right: 0 !important;
            pointer-events: none !important;
            margin: 0 !important;
        }
        ::ng-deep .slider-header-carousel .owl-nav .owl-prev,
        ::ng-deep .slider-header-carousel .owl-nav .owl-next {
            pointer-events: all !important;
            position: absolute !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 64px !important;
            width: 64px !important;
            min-height: 64px !important;
            min-width: 64px !important;
            padding: 0 !important;
            border-radius: 14px !important;
            background: rgba(255, 248, 220, 0.95) !important;
            border: none !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.22) !important;
            font-size: 0 !important;
            line-height: 1 !important;
            backdrop-filter: blur(6px) !important;
        }
        ::ng-deep .slider-header-carousel .owl-nav .owl-prev {
            left: 28px !important;
        }
        ::ng-deep .slider-header-carousel .owl-nav .owl-next {
            right: 28px !important;
        }
        ::ng-deep .slider-header-carousel .owl-nav .owl-prev svg,
        ::ng-deep .slider-header-carousel .owl-nav .owl-next svg {
            width: 26px !important;
            height: 26px !important;
            stroke: #128AA2 !important;
            display: block !important;
            flex-shrink: 0 !important;
        }
        ::ng-deep .slider-header-carousel .owl-nav .owl-prev:hover,
        ::ng-deep .slider-header-carousel .owl-nav .owl-next:hover {
            background: #FC8900 !important;
        }
        ::ng-deep .slider-header-carousel .owl-nav .owl-prev:hover svg,
        ::ng-deep .slider-header-carousel .owl-nav .owl-next:hover svg {
            stroke: #fff !important;
        }
        @media (max-width: 576px) {
            ::ng-deep .slider-header-carousel .owl-nav {
                display: none !important;
            }
        }
    `]
})
export class BannerComponent implements OnInit {
    private bannerService = inject(BannerService);

    readonly ui = BANNER;
    banners: Banner[] = [];

    sliderConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        infinite: true,
        vertical: true,
        verticalSwiping: true,
    };

    sliderConfig2 = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        autoplayDirection: 'normal',
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        rtl: true,
    };

    carouselOptions: OwlOptions = {
        loop: true,
        margin: 0,
        nav: true,
        dots: true,
        mouseDrag: false,
        items: 1,
        autoplay: true,
        autoHeight: false,
        navText: [
            "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'/></svg>",
            "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='9 18 15 12 9 6'/></svg>"
        ],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 2000,
        autoplayTimeout: 4000,
        autoplayHoverPause: false,
        responsive: {
            0:    { items: 1, nav: true },
            600:  { items: 1 },
            1000: { items: 1 }
        }
    };

    ngOnInit(): void {
        this.bannerService.getActivos().subscribe({
            next: (res) => { this.banners = res.data.filter(b => b.activo); },
            error: ()    => { this.banners = []; }
        });
    }
}
