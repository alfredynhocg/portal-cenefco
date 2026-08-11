import { Routes } from '@angular/router';
import { HitosInstitucionalesPageComponent } from './hitos-institucionales-page.component';

export const HITOS_INSTITUCIONALES_ROUTES: Routes = [
    { path: 'hitos-institucionales', component: HitosInstitucionalesPageComponent, data: { title: 'Hitos Institucionales' } },
];
