import { Component, ViewEncapsulation } from '@angular/core';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { AcreditacionesComponent } from '../cenefco/components/acreditaciones/acreditaciones.component';

@Component({
    selector: 'app-acreditaciones-page',
    imports: [BreadcrumbComponent, AcreditacionesComponent],
    templateUrl: './acreditaciones-page.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .ap-hero {
            position: relative;
            min-height: 280px;
            display: flex;
            align-items: flex-end;
            overflow: hidden;
            background: #128AA2;
        }
        .ap-hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; opacity: 0.22;
        }
        .ap-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.92) 100%);
        }
        .ap-hero-body {
            position: relative; z-index: 1;
            padding: 48px 0 36px; width: 100%; text-align: center;
        }
        .ap-hero-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(255,255,255,0.12); color: #fff;
            font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
            padding: 5px 16px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
        }
        .ap-hero-badge i { color: #FC8900; }
        .ap-hero-title {
            font-size: clamp(28px, 4vw, 44px); font-weight: 800;
            color: #fff; line-height: 1.15; margin-bottom: 16px;
        }
        .ap-hero-title span { color: #FC8900; }

        @media (max-width: 767px) {
            .ap-hero-body { padding: 32px 0 24px; }
        }
    `]
})
export class AcreditacionesPageComponent {}
