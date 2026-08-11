import { Routes } from '@angular/router';
import { RedesSocialesPageComponent } from './redes-sociales-page.component';

export const REDES_SOCIALES_PAGE_ROUTES: Routes = [
    { path: 'redes-sociales', component: RedesSocialesPageComponent, data: { title: 'Redes Sociales' } },
];
