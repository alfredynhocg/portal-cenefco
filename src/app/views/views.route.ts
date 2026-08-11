import { Routes } from '@angular/router';
import { Home1Component } from './home-1/home-1.component';
import { CenefcoComponent } from './cenefco/cenefco.component';
import { FortaleciendoComponent } from './fortaleciendo/fortaleciendo.component';
import { AreasListComponent } from './areas/areas-list.component';
import { CursosListComponent } from './cursos/cursos-list.component';
import { CursoSlugRouterComponent } from './cursos/curso-slug-router.component';
import { CursosPasadosListComponent } from './cursos-pasados/cursos-pasados-list.component';
import { CursoPasadoDetailComponent } from './cursos-pasados/curso-pasado-detail.component';
import { Error404Component } from './error-404/error-404.component';
import { VideosComponent } from './videos/videos.component';
import { GaleriaFotosComponent } from './galeria-fotos/galeria-fotos.component';
import { FaqComponent } from './faq/faq.component';
import { ResenasComponent } from './resenas/resenas.component';
import { ConveniosComponent } from './convenios/convenios.component';
import { ConvenioDetailComponent } from './convenios/convenio-detail.component';
import { BibliotecaListComponent } from './biblioteca/biblioteca-list.component';
import { BibliotecaDetailComponent } from './biblioteca/biblioteca-detail.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PagoExitosoComponent } from './pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './pago-fallido/pago-fallido.component';
import { MisPagosComponent } from './mis-pagos/mis-pagos.component';
import { MisPagosDetalleComponent } from './mis-pagos/mis-pagos-detalle.component';
import { CarritoComponent } from './carrito/carrito.component';
import { LoginComponent } from '../auth/presentation/login/login.component';
import { RegistroComponent } from '../auth/presentation/registro/registro.component';
import { TriviaComponent } from '../trivia/presentation/trivia/trivia.component';

export const VIEWS_ROUTES: Routes = [
    {
        path: '',
        component: Home1Component,
        pathMatch: 'full',
        data: { title: 'Inicio' }
    },
    {
        path: 'cenefco',
        component: CenefcoComponent,
        data: { title: 'CENEFCO' }
    },
    {
        path: 'areas',
        component: AreasListComponent,
        data: { title: 'Áreas de Conocimiento' }
    },
    {
        path: 'cursos',
        component: CursosListComponent,
        data: { title: 'Cursos y Programas' }
    },
    {
        path: 'cursos/:slug',
        component: CursoSlugRouterComponent,
        data: { title: 'Detalle del Curso' }
    },
    {
        path: 'cursos-pasados',
        component: CursosPasadosListComponent,
        data: { title: 'Cursos Anteriores' }
    },
    {
        path: 'checkout/:session_id',
        component: CheckoutComponent,
        data: { title: 'Verificando pago...' }
    },
    {
        path: 'pago-exitoso',
        component: PagoExitosoComponent,
        data: { title: '¡Pago confirmado!' }
    },
    {
        path: 'pago-fallido',
        component: PagoFallidoComponent,
        data: { title: 'Pago no completado' }
    },
    {
        path: 'videos',
        component: VideosComponent,
        data: { title: 'Videos' }
    },
    {
        path: 'galeria',
        component: GaleriaFotosComponent,
        data: { title: 'Galería de Fotos' }
    },
    {
        path: 'preguntas-frecuentes',
        component: FaqComponent,
        data: { title: 'Preguntas Frecuentes' }
    },
    {
        path: 'reseñas',
        component: ResenasComponent,
        data: { title: 'Reseñas de Estudiantes' }
    },
    {
        path: 'resenas',
        component: ResenasComponent,
        data: { title: 'Reseñas de Estudiantes' }
    },
    {
        path: 'convenios',
        component: ConveniosComponent,
        data: { title: 'Convenios' }
    },
    {
        path: 'convenios/:id',
        component: ConvenioDetailComponent,
        data: { title: 'Detalle del Convenio' }
    },
    {
        path: 'biblioteca',
        component: BibliotecaListComponent,
        data: { title: 'Biblioteca' }
    },
    {
        path: 'biblioteca/:tipo/:slug',
        component: BibliotecaDetailComponent,
        data: { title: 'Publicación' }
    },
    {
        path: 'fortalenciendo-tu-educacion',
        component: FortaleciendoComponent,
        data: { title: 'Fortaleciendo tu Educación' }
    },
    {
        path: '',
        loadChildren: () =>
            import('./noticias/noticias.route').then((m) => m.NOTICIAS_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./articulos/articulos.route').then((m) => m.ARTICULOS_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./hitos-institucionales/hitos-institucionales.route').then((m) => m.HITOS_INSTITUCIONALES_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./acreditaciones-page/acreditaciones-page.route').then((m) => m.ACREDITACIONES_PAGE_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./redes-sociales-page/redes-sociales-page.route').then((m) => m.REDES_SOCIALES_PAGE_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./boletines/boletines.route').then((m) => m.BOLETINES_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./comunicados/comunicados.route').then((m) => m.COMUNICADOS_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./eventos/eventos.route').then((m) => m.EVENTOS_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./calendario-academico/calendario-academico.route').then((m) => m.CALENDARIO_ACADEMICO_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./other-pages/other-pages.route').then((m) => m.OTHER_PAGES_ROUTES),
    },
    {
        path: '',
        loadChildren: () =>
            import('./blogs/blogs.route').then((m) => m.BLOGS_ROUTES),
    },
    {
        path: 'carrito',
        component: CarritoComponent,
        data: { title: 'Mi Carrito' }
    },
    {
        path: 'mi-cuenta',
        component: MisPagosComponent,
        data: { title: 'Mi Cuenta' }
    },
    {
        path: 'mi-cuenta/:id_ins',
        component: MisPagosDetalleComponent,
        data: { title: 'Detalle de Inscripción' }
    },
    {
        path: 'mis-pagos',
        redirectTo: 'mi-cuenta',
    },
    {
        path: 'mis-pagos/:id_ins',
        redirectTo: 'mi-cuenta/:id_ins',
    },
    {
        path: 'cursos-pasados/:slug',
        component: CursoPasadoDetailComponent,
        data: { title: 'Detalle del Curso' }
    },
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Iniciar sesión' }
    },
    {
        path: 'trivia',
        component: TriviaComponent,
        data: { title: 'Juego de Trivia' }
    },
    {
        path: 'registro',
        component: RegistroComponent,
        data: { title: 'Crear cuenta' }
    },
    {
        path: ':slug',
        component: CursoSlugRouterComponent,
        data: { title: 'Detalle del Curso' }
    },
    {
        path: '**',
        component: Error404Component,
        data: { title: 'Página no encontrada' }
    },
];
