import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoletinService } from '../../../../boletines/application/services/boletin.service';
import { Boletin } from '../../../../boletines/domain/models/boletin.model';

@Component({
    selector: 'app-latest-bulletins',
    imports: [CommonModule, RouterLink],
    templateUrl: './latest-bulletins.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .cbl-section { background: #fff; }

        .cbl-badge {
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
        .cbl-badge i { color: #FC8900; }

        .cbl-title {
            font-size: clamp(26px, 3.5vw, 38px);
            font-weight: 800;
            color: #128AA2;
            line-height: 1.2;
            margin-bottom: 14px;
        }
        .cbl-subtitle {
            font-size: 15px;
            color: #666;
            line-height: 1.7;
        }

        .cbl-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.08);
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            display: flex;
            flex-direction: column;
            height: 100%;
            transition: transform .3s ease, box-shadow .3s ease;
        }
        .cbl-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(18,138,162,0.13);
        }

        .cbl-card-img {
            position: relative;
            height: 220px;
            overflow: hidden;
            flex-shrink: 0;
        }
        .cbl-card-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .5s ease;
        }
        .cbl-card:hover .cbl-card-img img { transform: scale(1.06); }

        .cbl-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 40%, rgba(18,138,162,0.65) 100%);
            pointer-events: none;
        }

        .cbl-num-badge {
            position: absolute;
            top: 14px;
            left: 14px;
            background: #FC8900;
            color: #fff;
            font-size: 11px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 2px 8px rgba(252,137,0,0.35);
        }

        .cbl-date-chip {
            position: absolute;
            bottom: 12px;
            right: 14px;
            background: rgba(255,255,255,0.18);
            backdrop-filter: blur(6px);
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.25);
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .cbl-date-chip i { color: #FC8900; font-size: 10px; }

        .cbl-card-body {
            padding: 22px 22px 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .cbl-card-title {
            font-size: 16px;
            font-weight: 700;
            color: #128AA2;
            line-height: 1.4;
            margin-bottom: 12px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-decoration: none;
            transition: color .2s;
        }
        .cbl-card-title:hover { color: #FC8900; }

        .cbl-card-desc {
            font-size: 13.5px;
            color: #666;
            line-height: 1.65;
            flex: 1;
            margin-bottom: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .cbl-card-divider {
            height: 1px;
            background: rgba(18,138,162,0.08);
            margin-bottom: 16px;
        }

        .cbl-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-top: auto;
        }
        .cbl-card-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 700;
            color: #128AA2;
            border: 1.5px solid rgba(18,138,162,0.22);
            border-radius: 8px;
            padding: 8px 16px;
            text-decoration: none;
            transition: all .25s ease;
        }
        .cbl-card-btn:hover {
            background: #128AA2;
            border-color: #128AA2;
            color: #fff;
        }
        .cbl-card-btn i { font-size: 11px; }

        .cbl-cta {
            display: flex;
            justify-content: center;
            margin-top: 40px;
        }
        .cbl-cta-btn {
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
        .cbl-cta-btn:hover {
            background: #FC8900;
            color: #fff;
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(252,137,0,0.30);
        }
        .cbl-cta-btn i { font-size: 13px; }

        .cbl-skeleton-img {
            height: 220px;
            background: #f0f1f3;
            border-radius: 16px 16px 0 0;
            animation: cbl-pulse 1.4s ease-in-out infinite;
        }
        .cbl-skeleton-body { padding: 22px; }
        .cbl-skeleton-line {
            height: 14px;
            background: #f0f1f3;
            border-radius: 6px;
            margin-bottom: 10px;
            animation: cbl-pulse 1.4s ease-in-out infinite;
        }
        .cbl-skeleton-line.short { width: 55%; }
        @keyframes cbl-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: .45; }
        }

        @media (max-width: 767px) {
            .cbl-card-img { height: 200px; }
        }
    `]
})
export class LatestBulletinsComponent implements OnInit {
    private boletinService = inject(BoletinService);
    private cdr = inject(ChangeDetectorRef);

    boletines: Boletin[] = [];
    loading = true;

    readonly fallbackImgs = [
        'assets/img/all-images/blog-img1.png',
        'assets/img/all-images/blog-img2.png',
        'assets/img/all-images/blog-img3.png',
    ];

    readonly fallbackBoletines: Boletin[] = [1, 2, 3].map(n => ({
        id_boletin: n,
        num_boletin: n,
        titulo_boletin: `Boletín Institucional N° ${n}`,
        titulo_pagina: null,
        descripcion_boletin: 'Publicación institucional con novedades y logros académicos del CENEFCO.',
        imagen_url: null,
        slug: null,
        fecha_reg: null,
        estado: 1,
    }));

    ngOnInit(): void {
        this.boletinService.getRecientes(3).subscribe({
            next: (res) => {
                this.boletines = res.data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
}
