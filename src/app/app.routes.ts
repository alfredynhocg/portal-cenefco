import { Routes } from '@angular/router';
import { LayoutComponent } from '@layouts/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        loadChildren: () =>
            import('./views/views.route').then((mod) => mod.VIEWS_ROUTES),
    },
];
