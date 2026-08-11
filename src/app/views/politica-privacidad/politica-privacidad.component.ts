import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@app/components/breadcrumb/breadcrumb.component';
import { POLITICA_PRIVACIDAD_PAGE } from '@core/constants/politica-privacidad.constance';

@Component({
    selector: 'app-politica-privacidad',
    imports: [BreadcrumbComponent],
    templateUrl: './politica-privacidad.component.html',
    styles: [`
    :host ::ng-deep .hero1-section-area.about-bg-area {
        padding-top: 150px !important;
        padding-bottom: 80px !important;
        min-height: unset !important;
        height: auto !important;
    }
  `]
})
export class PoliticaPrivacidadComponent {
    readonly CONSTANTS = POLITICA_PRIVACIDAD_PAGE;
}
