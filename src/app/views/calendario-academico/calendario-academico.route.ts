import { Routes } from '@angular/router';
import { CalendarioAcademicoComponent } from './calendario-academico.component';

export const CALENDARIO_ACADEMICO_ROUTES: Routes = [
    { path: 'calendario-academico', component: CalendarioAcademicoComponent, data: { title: 'Calendario Académico' } },
];
