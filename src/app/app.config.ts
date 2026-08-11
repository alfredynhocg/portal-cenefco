import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { IMAGE_CONFIG, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { decryptResponseInterceptor } from './core/interceptors/decrypt-response.interceptor';
import { ssrAbsoluteUrlInterceptor } from './core/interceptors/ssr-absolute-url.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })), provideAnimations(), provideHttpClient(withFetch(), withInterceptors([ssrAbsoluteUrlInterceptor, authInterceptor, decryptResponseInterceptor])), { provide: LOCALE_ID, useValue: 'es' }, {
        provide: IMAGE_CONFIG,
        useValue: {
            disableImageSizeWarning: true,
            disableImageLazyLoadWarning: true
        }
    }, provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({ includeHeaders: ['X-Encrypted'] })),]
};
