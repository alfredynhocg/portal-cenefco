import { Routes } from '@angular/router';
import { ArticulosListComponent } from './articulos-list.component';
import { ArticuloDetailComponent } from './articulo-detail.component';
import { ARTICULOS } from '@core/constants/articulo.constance';

export const ARTICULOS_ROUTES: Routes = [
    { path: 'articulos', component: ArticulosListComponent, data: { title: ARTICULOS.breadcrumb.title } },
    { path: 'articulos/:slug', component: ArticuloDetailComponent, data: { title: 'Detalle ' + ARTICULOS.breadcrumb.subTitleFallback } },
];
