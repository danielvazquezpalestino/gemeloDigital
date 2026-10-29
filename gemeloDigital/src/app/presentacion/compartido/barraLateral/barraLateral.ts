import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    effect,
    input,
    output,
    viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { iconoSeccion } from '../iconos/iconoSeccion';
import { navegacionPanel, seccionNavegacion } from '../navegacion/seccionesNavegacion';

/**
 * Barra lateral de navegación del panel.
 *
 * Es un componente de presentación: recibe si está abierta (solo relevante en
 * pantallas pequeñas) y avisa al diseño cuando debe cerrarse.
 */
@Component({
    selector: 'gd-barra-lateral',
    imports: [RouterLink, RouterLinkActive, iconoSeccion],
    templateUrl: './barraLateral.html',
    styleUrl: './barraLateral.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'gd-barra-lateral',
        '[class.gd-barra-lateral--abierta]': 'abierto()',
    },
})
export class barraLateral
{
    readonly abierto = input(false);
    readonly cerrar = output<void>();

    protected readonly secciones: readonly seccionNavegacion[] = navegacionPanel.secciones;

    private readonly botonCerrar = viewChild<ElementRef<HTMLButtonElement>>('botonCerrar');

    constructor()
    {
        // El foco entra en el panel al abrirse en móvil, para no dejarlo detrás
        // del velo junto al botón que lo abrió. Se aplaza al siguiente turno
        // porque hasta que el host es visible el navegador ignora el foco.
        effect(() =>
        {
            if (!this.abierto())
            {
                return;
            }

            setTimeout(() => this.botonCerrar()?.nativeElement.focus());
        });
    }
}
