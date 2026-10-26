import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { autenticacionInterceptor } from './infraestructura/http/autenticacion.interceptor';
import { proveedoresAutenticacion } from './nucleo/proveedores/proveedoresAutenticacion';
import { routes } from './app.routes';

/**
 * Raíz de composición de la aplicación.
 *
 * Aquí se cablean los puertos de la aplicación con sus adaptadores de
 * infraestructura; la presentación solo recibe abstracciones.
 */
export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch(), withInterceptors([autenticacionInterceptor])),
        ...proveedoresAutenticacion,
    ],
};
