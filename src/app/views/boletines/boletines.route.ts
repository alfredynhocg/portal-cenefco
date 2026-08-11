import { Routes } from '@angular/router';
import { BoletinesListComponent } from './boletines-list.component';
import { BoletinDetailComponent } from './boletin-detail.component';
import { BOLETINES } from '@core/constants/boletin.constance';

export const BOLETINES_ROUTES: Routes = [
    { path: 'boletines', component: BoletinesListComponent, data: { title: BOLETINES.breadcrumb.title } },
    { path: 'boletines/:slug', component: BoletinDetailComponent, data: { title: 'Detalle ' + BOLETINES.breadcrumb.subTitleFallback } },
];
