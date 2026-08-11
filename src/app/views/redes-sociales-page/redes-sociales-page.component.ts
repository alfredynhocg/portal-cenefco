import { Component, OnInit, inject, signal, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { RedSocialService } from '../../redes-sociales/application/services/red-social.service';
import { RedSocial } from '../../redes-sociales/domain/models/red-social.model';

@Component({
    selector: 'app-redes-sociales-page',
    imports: [CommonModule, BreadcrumbComponent],
    templateUrl: './redes-sociales-page.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`

        .rs-hero {
            position: relative;
            min-height: 280px;
            display: flex;
            align-items: flex-end;
            overflow: hidden;
            background: #128AA2;
        }
        .rs-hero-bg {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover; opacity: 0.22;
        }
        .rs-hero-overlay {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.92) 100%);
        }
        .rs-hero-body {
            position: relative; z-index: 1;
            padding: 48px 0 36px; width: 100%; text-align: center;
        }
        .rs-hero-badge {
            display: inline-flex; align-items: center; gap: 7px;
            background: rgba(255,255,255,0.12); color: #fff;
            font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
            padding: 5px 16px; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.22); margin-bottom: 14px;
        }
        .rs-hero-badge i { color: #FC8900; }
        .rs-hero-title {
            font-size: clamp(28px, 4vw, 44px); font-weight: 800;
            color: #fff; line-height: 1.15; margin-bottom: 16px;
        }
        .rs-hero-title span { color: #FC8900; }

        .rs-section { background: #f4f7f9; padding: 64px 0 80px; }

        .rs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 20px;
            max-width: 900px;
            margin: 0 auto;
        }

        .rs-card {
            background: #fff;
            border: 1px solid rgba(18,138,162,0.10);
            border-radius: 16px;
            padding: 26px 22px;
            display: flex;
            align-items: center;
            gap: 16px;
            text-decoration: none;
            transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .rs-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px rgba(18,138,162,0.12);
            border-color: #128AA2;
        }

        .rs-icon-wrap {
            width: 52px; height: 52px;
            border-radius: 14px;
            background: rgba(18,138,162,0.08);
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
        }
        .rs-icon-wrap i { font-size: 22px; color: #128AA2; }

        .rs-card-info { min-width: 0; }
        .rs-card-nombre {
            font-size: 15px; font-weight: 800;
            color: #0a2433; text-transform: capitalize;
            margin: 0 0 3px;
        }
        .rs-card-desc {
            font-size: 12.5px; color: #6b7280;
            margin: 0;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .rs-empty { text-align: center; padding: 60px 24px; color: #bbb; }
        .rs-empty i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }
        .rs-empty p { font-size: 15px; margin: 0; }

        .rs-skel { opacity: 0.6; }
        .rs-skel-block {
            background: rgba(18,138,162,0.08);
            border-radius: 8px;
            animation: rsPulse 1.5s ease-in-out infinite;
        }
        @keyframes rsPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        @media (max-width: 767px) {
            .rs-hero-body { padding: 32px 0 24px; }
            .rs-section { padding: 48px 0 64px; }
        }
    `]
})
export class RedesSocialesPageComponent implements OnInit {
    private service = inject(RedSocialService);
    private cdr = inject(ChangeDetectorRef);

    redesSociales = signal<RedSocial[]>([]);
    cargando = signal(true);

    ngOnInit(): void {
        this.service.getActivas().subscribe({
            next: (res) => {
                this.redesSociales.set(res.data ?? []);
                this.cargando.set(false);
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando.set(false);
                this.cdr.detectChanges();
            },
        });
    }
}
