import { Routes } from '@angular/router';
import { EventosListComponent } from './eventos-list.component';
import { EventoDetailComponent } from './evento-detail.component';

export const EVENTOS_ROUTES: Routes = [
    { path: 'eventos', component: EventosListComponent, data: { title: 'Eventos' } },
    { path: 'eventos/:id', component: EventoDetailComponent, data: { title: 'Detalle de Evento' } },
];
