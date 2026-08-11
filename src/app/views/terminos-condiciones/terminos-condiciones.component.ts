import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { TERMINOS_PAGE } from '@core/constants/terminos-condiciones.constance';

@Component({
    selector: 'app-terminos-condiciones',
    imports: [BreadcrumbComponent],
    templateUrl: './terminos-condiciones.component.html',
    styles: [`
    :host ::ng-deep .hero1-section-area.about-bg-area {
        padding-top: 150px !important;
        padding-bottom: 80px !important;
        min-height: unset !important;
        height: auto !important;
    }
  `]
})
export class TerminosCondicionesComponent {
    readonly CONSTANTS = TERMINOS_PAGE;
}
