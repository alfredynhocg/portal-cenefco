import { Routes } from '@angular/router';
import { NoticiasListComponent } from './noticias-list.component';
import { NoticiaDetailComponent } from './noticia-detail.component';
import { NOTICIAS } from '@core/constants/noticia.constance';

export const NOTICIAS_ROUTES: Routes = [
    { path: 'noticias', component: NoticiasListComponent, data: { title: NOTICIAS.breadcrumb.title } },
    { path: 'noticias/:slug', component: NoticiaDetailComponent, data: { title: 'Detalle ' + NOTICIAS.breadcrumb.subTitleFallback } },
];
