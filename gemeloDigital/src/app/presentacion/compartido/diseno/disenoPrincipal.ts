import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { barraLateral } from '../barraLateral/barraLateral';
import { encabezado } from '../encabezado/encabezado';
import { navegacionPanel } from '../navegacion/seccionesNavegacion';

/**
 * Armazón del área autenticada: barra lateral, encabezado y contenido.
 *
 * Las páginas protegidas se cargan en el `router-outlet` interno, de modo que
 * todas comparten la misma navegación y no repiten la cabecera.
 */
@Component({
    selector: 'gd-diseno-principal',
    imports: [RouterOutlet, barraLateral, encabezado],
    templateUrl: './disenoPrincipal.html',
    styleUrl: './disenoPrincipal.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'gd-diseno-principal',
        '(document:keydown.escape)': 'cerrarMenu()',
    },
})
export class disenoPrincipal
{
    private readonly enrutador = inject(Router);

    protected readonly menuAbierto = signal(false);

    private readonly urlActual = toSignal(
        this.enrutador.events.pipe(
            filter((evento) => evento instanceof NavigationEnd),
            map(() => this.enrutador.url),
        ),
        { initialValue: this.enrutador.url },
    );

    protected readonly tituloPagina = computed(
        () => navegacionPanel.seccionActual(this.urlActual()).etiqueta,
    );

    constructor()
    {
        // Al cambiar de sección el menú móvil debe quedar cerrado.
        effect(() =>
        {
            this.urlActual();
            this.menuAbierto.set(false);
        });
    }

    protected abrirMenu(): void
    {
        this.menuAbierto.set(true);
    }

    protected cerrarMenu(): void
    {
        this.menuAbierto.set(false);
    }
}
