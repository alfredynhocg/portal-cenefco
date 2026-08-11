import { Routes } from '@angular/router';
import { ComunicadosListComponent } from './comunicados-list.component';
import { ComunicadoDetailComponent } from './comunicado-detail.component';
import { COMUNICADOS } from '@core/constants/comunicado.constance';

export const COMUNICADOS_ROUTES: Routes = [
    { path: 'comunicados', component: ComunicadosListComponent, data: { title: COMUNICADOS.breadcrumb.title } },
    { path: 'comunicados/:slug', component: ComunicadoDetailComponent, data: { title: 'Detalle ' + COMUNICADOS.breadcrumb.subTitleFallback } },
];
