import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, type OwlOptions } from 'ngx-owl-carousel-o';
import { ConvenioService, Convenio } from '../../../../convenios/convenio.service';

@Component({
    selector: 'app-partner-institutions',
    imports: [CarouselModule, CommonModule, RouterLink],
    templateUrl: './partner-institutions.component.html',
    styles: ``
})
export class PartnerInstitutionsComponent implements OnInit {

    private convenioService = inject(ConvenioService);
    private cdr = inject(ChangeDetectorRef);

    convenios: Convenio[] = [];

    carouselOptions: OwlOptions = {
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        mouseDrag: true,
        autoplay: true,
        smartSpeed: 2000,
        autoplayTimeout: 3000,
        responsive: {
            0: { items: 2 },
            600: { items: 3 },
            1000: { items: 4 }
        }
    };

    ngOnInit(): void {
        this.convenioService.getAll().subscribe({
            next: (data) => {
                this.convenios = data
                    .map(c => ({ ...c, logo_url: c.logo_url ? `/storage/${c.logo_url}` : null }));
                this.cdr.detectChanges();
            }
        });
    }
}
