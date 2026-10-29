import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        // El panel y todas sus secciones dependen de la sesión del navegador:
        // se renderizan en cliente para no ejecutar guardias durante el
        // prerender ni en el servidor de desarrollo.
        path: 'panel',
        renderMode: RenderMode.Client,
    },
    {
        path: 'panel/**',
        renderMode: RenderMode.Client,
    },
    {
        path: '**',
        renderMode: RenderMode.Prerender,
    },
];
