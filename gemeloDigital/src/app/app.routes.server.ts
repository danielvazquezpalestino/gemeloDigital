import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        // El panel depende de la sesión del navegador: se renderiza en cliente
        // para no ejecutar guardias durante el prerender.
        path: 'panel',
        renderMode: RenderMode.Client,
    },
    {
        path: '**',
        renderMode: RenderMode.Prerender,
    },
];
