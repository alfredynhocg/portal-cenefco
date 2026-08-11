import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AreaPortalService } from '../../areas/application/services/area.service';
import { Area } from '../../areas/domain/models/area.model';
import { ImageUrlPipe } from '../../core/pipes/image-url.pipe';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';

@Component({
    selector: 'app-areas-list',
    imports: [CommonModule, RouterLink, BreadcrumbComponent, ImageUrlPipe, TruncatePipe],
    templateUrl: './areas-list.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        .al-hero {
            position: relative;
            min-height: 280px;
            display: flex;
            align-items: flex-end;
            overflow: hidden;
            background: #128AA2;
        }
        .al-hero-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.22;
        }
        .al-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(18,138,162,0.50) 0%, rgba(18,138,162,0.90) 100%);
        }
        .al-hero-body {
            position: relative;
            z-index: 1;
            padding: 48px 0 36px;
            width: 100%;
            text-align: center;
        }
        .al-hero-badge {
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
            border: 1px solid rgba(255,255,255,0.22);
            margin-bottom: 14px;
        }
        .al-hero-badge i { color: #FC8900; }
        .al-hero-title {
            font-size: clamp(28px, 4vw, 44px);
            font-weight: 800;
            color: #fff;
            line-height: 1.15;
            margin-bottom: 16px;
        }
        .al-hero-title span { color: #FC8900; }

        .al-section { background: #f4f7f9; padding: 56px 0 80px; }

        .al-section-header {
            text-align: center;
            margin-bottom: 44px;
        }
        .al-section-header p {
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .al-section-header h2 {
            font-size: clamp(22px, 3vw, 34px);
            font-weight: 800;
            color: #128AA2;
            line-height: 1.2;
        }
        .al-section-header h2 span { color: #FC8900; }

        .al-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 28px;
        }

        .al-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
            box-shadow: 0 4px 20px rgba(18,138,162,0.07);
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            text-decoration: none;
        }
        .al-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(18,138,162,0.14);
        }
        .al-card-top {
            height: 8px;
        }
        .al-card-body {
            padding: 28px 24px 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
        }
        .al-card-icon {
            width: 80px;
            height: 80px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            color: #fff;
            margin-bottom: 4px;
            flex-shrink: 0;
            transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .al-card:hover .al-card-icon {
            transform: scale(1.12) rotate(-4deg);
            box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }
        .al-card-logo {
            width: 140px;
            height: 80px;
            object-fit: contain;
            transition: transform 0.35s ease;
        }
        .al-card:hover .al-card-logo {
            transform: scale(1.1);
        }
        .al-card-title {
            font-size: 1.05rem;
            font-weight: 700;
            color: #128AA2;
            line-height: 1.3;
            margin: 0;
        }
        .al-card-desc {
            font-size: 0.88rem;
            color: #6b7280;
            line-height: 1.6;
            margin: 0;
            flex: 1;
        }
        .al-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 24px;
            border-top: 1px solid #f0f2f5;
            background: #fafbfc;
        }
        .al-card-count {
            font-size: 0.8rem;
            color: #9ca3af;
            font-weight: 500;
        }
        .al-card-count span {
            font-weight: 700;
            color: #128AA2;
        }
        .al-card-link {
            font-size: 0.82rem;
            font-weight: 700;
            color: #FC8900;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .al-skeleton {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(18,138,162,0.07);
        }
        .al-skel-top  { height: 8px; background: #e8edf2; }
        .al-skel-body { padding: 28px 24px; }
        .al-skel-icon { width: 140px; height: 80px; border-radius: 12px; background: #e8edf2; margin-bottom: 14px; }
        .al-skel-line { height: 12px; background: #e8edf2; border-radius: 6px; margin-bottom: 10px; animation: alPulse 1.5s ease-in-out infinite; }
        .al-skel-line.short { width: 60%; }

        @keyframes alPulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.45; }
        }

        .al-empty {
            text-align: center;
            padding: 60px 24px;
            color: #bbb;
        }
        .al-empty i { font-size: 48px; margin-bottom: 16px; display: block; color: #dde4e8; }

        @media (max-width: 767px) {
            .al-grid { grid-template-columns: 1fr; gap: 18px; }
            .al-hero-body { padding: 32px 0 24px; }
        }
    `]
})
export class AreasListComponent implements OnInit {
    private service = inject(AreaPortalService);
    private cdr     = inject(ChangeDetectorRef);

    areas    : Area[] = [];
    cargando  = true;

    ngOnInit(): void {
        this.service.getAll().subscribe({
            next: data => {
                this.areas   = data;
                this.cargando = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cargando = false;
                this.cdr.detectChanges();
            }
        });
    }

}
