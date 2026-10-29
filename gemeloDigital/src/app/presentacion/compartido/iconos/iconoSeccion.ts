import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { tipoIconoSeccion } from '../navegacion/seccionesNavegacion';

/**
 * Icono de una sección del panel.
 *
 * Los trazos son decorativos: el nombre accesible lo aporta siempre el texto
 * que acompaña al icono, por eso el SVG se oculta a los lectores de pantalla.
 */
@Component({
    selector: 'gd-icono-seccion',
    template: `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            @switch (tipo()) {
                @case ('resumen') {
                    <path d="M4 13h6v7H4zM4 4h6v6H4zM13 4h7v10h-7zM13 17h7v3h-7z"
                        fill="currentColor" opacity="0.85" />
                }
                @case ('solar') {
                    <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.85" />
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
                        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                }
                @case ('clima') {
                    <path d="M7.5 17a4 4 0 0 1 0-8 5.2 5.2 0 0 1 10 -.6A3.6 3.6 0 0 1 17 17z"
                        fill="currentColor" opacity="0.85" />
                    <path d="M8 20.5l.8-1.6M12.4 20.5l.8-1.6M16.8 20.5l.8-1.6"
                        stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                }
                @case ('tarifas') {
                    <path d="M13 2 5 14h5l-1 8 8-12h-5z" fill="currentColor" opacity="0.85" />
                }
                @case ('incentivos') {
                    <circle cx="12" cy="9" r="5.5" stroke="currentColor" stroke-width="1.6" />
                    <path d="M8.5 13.6 7 22l5-2.6 5 2.6-1.5-8.4" stroke="currentColor"
                        stroke-width="1.6" stroke-linejoin="round" />
                }
                @case ('financiero') {
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                    <path d="M12 7v10M14.6 9.2A2.6 2.6 0 0 0 12 8h-.6a2.1 2.1 0 0 0 0 4.2h1.2a2.1 2.1 0 0 1 0 4.2H12a2.6 2.6 0 0 1-2.6-1.2"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                }
                @case ('simulaciones') {
                    <path d="M4 18V9M10 18V4M16 18v-6M22 18H2" stroke="currentColor"
                        stroke-width="1.8" stroke-linecap="round" />
                }
            }
        </svg>
    `,
    styles: `
        :host {
            display: inline-flex;
            flex: none;
        }

        svg {
            width: 1.15rem;
            height: 1.15rem;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class iconoSeccion
{
    readonly tipo = input.required<tipoIconoSeccion>();
}
