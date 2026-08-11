import { Routes } from '@angular/router';
import { Error404Component } from './error-404/error-404.component';
import { SeguimientoComponent } from '../seguimiento/seguimiento.component';
import { ContactUsComponent as ContactosComponent } from '../contactos/contactos.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';

export const OTHER_PAGES_ROUTES: Routes = [
    {
        path: '404',
        component: Error404Component,
    },
    {
        path: 'contacto',
        component: ContactosComponent,
        data: { title: 'Contacto' }
    },
    {
        path: 'contactos',
        component: ContactosComponent,
        data: { title: 'Contactos' }
    },
    {
        path: 'verificar-certificado',
        component: SeguimientoComponent,
        data: { title: 'Verificación de Certificado' }
    },
    {
        path: 'chatbot',
        component: ChatbotComponent,
        data: { title: 'Chatbot CENEFCO' }
    },
];
