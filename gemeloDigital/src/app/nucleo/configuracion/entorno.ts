import { InjectionToken } from '@angular/core';

/**
 * URL base de la API.
 *
 * En desarrollo, `proxy.conf.json` redirige `/api` al backend; en producción
 * se espera que la API se sirva bajo el mismo origen.
 */
export const urlBaseApi = new InjectionToken<string>('urlBaseApi', {
    providedIn: 'root',
    factory: () => '/api',
});
