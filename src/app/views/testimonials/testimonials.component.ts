import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BreadcrumbComponent } from "@app/components/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TESTIMONIALS_PAGE } from '@core/constants/testimonials-page.constance';
import { TestimonioService, Testimonio } from '../../testimonios/testimonio.service';

@Component({
    selector: 'app-testimonials',
    imports: [BreadcrumbComponent, CommonModule, RouterModule],
    templateUrl: './testimonials.component.html',
    styles: [`
    :host ::ng-deep .hero1-section-area.about-bg-area {
        padding-top: 150px !important;
        padding-bottom: 80px !important;
        min-height: unset !important;
        height: auto !important;
    }
  `]
})
export class TestimonialsComponent implements OnInit {
    readonly CONSTANTS = TESTIMONIALS_PAGE;
    testimonios: Testimonio[] = [];
    useApi = false;

    private testimonioService = inject(TestimonioService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.testimonioService.getAll().subscribe({
            next: (res) => {
                if (res.data && res.data.length > 0) {
                    this.testimonios = res.data;
                    this.useApi = true;
                }
                this.cdr.detectChanges();
            }
        });
    }

    getStars(calificacion: number | null): number[] {
        return Array(calificacion ?? 5).fill(0);
    }

    getFotoUrl(fotoUrl: string | null): string {
        if (!fotoUrl) return 'assets/img/all-images/testimonial-img11.png';
        if (fotoUrl.startsWith('http')) return fotoUrl;
        return `/storage/${fotoUrl}`;
    }
}
