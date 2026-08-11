import { Routes } from '@angular/router';
import { AcreditacionesPageComponent } from './acreditaciones-page.component';

export const ACREDITACIONES_PAGE_ROUTES: Routes = [
    { path: 'acreditaciones', component: AcreditacionesPageComponent, data: { title: 'Acreditaciones' } },
];
