import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    computed,
    effect,
    inject,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { almacenamientoSesion } from '../../../aplicacion/puertos/almacenamientoSesion';
import { cerrarSesion as cerrarSesionCasoUso } from '../../../aplicacion/casosDeUso/cerrarSesion.casoUso';
import { usuario } from '../../../dominio/entidades/usuario.entidad';

/**
 * Encabezado del panel.
 *
 * Muestra la sección activa, la identidad del usuario y la acción de cerrar
 * sesión. En pantallas pequeñas expone el botón que abre la barra lateral.
 */
@Component({
    selector: 'gd-encabezado',
    templateUrl: './encabezado.html',
    styleUrl: './encabezado.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'gd-encabezado' },
})
export class encabezado
{
    private readonly casoUsoCerrarSesion = inject(cerrarSesionCasoUso);
    private readonly almacenamiento = inject(almacenamientoSesion);
    private readonly enrutador = inject(Router);

    readonly titulo = input.required<string>();
    readonly menuAbierto = input(false);
    readonly abrirMenu = output<void>();

    protected readonly usuarioActual = signal<usuario | null>(
        this.almacenamiento.obtener()?.usuario ?? null,
    );

    protected readonly iniciales = computed(() => this.calcularIniciales(this.usuarioActual()));

    private readonly botonMenu = viewChild<ElementRef<HTMLButtonElement>>('botonMenu');
    private menuEstuvoAbierto = false;

    constructor()
    {
        // Al cerrar el menú móvil el foco regresa al botón que lo abrió.
        effect(() =>
        {
            const abierto = this.menuAbierto();

            if (this.menuEstuvoAbierto && !abierto)
            {
                this.botonMenu()?.nativeElement.focus();
            }

            this.menuEstuvoAbierto = abierto;
        });
    }

    protected async cerrar(): Promise<void>
    {
        this.casoUsoCerrarSesion.ejecutar();
        await this.enrutador.navigateByUrl('/iniciar-sesion');
    }

    /**
     * Iniciales para el avatar: primera letra del primer y del último nombre.
     */
    private calcularIniciales(usuarioActual: usuario | null): string
    {
        const palabras = usuarioActual?.nombre.trim().split(/\s+/).filter(Boolean) ?? [];

        if (palabras.length === 0)
        {
            return '';
        }

        const primera = palabras[0].charAt(0);
        const ultima = palabras[palabras.length - 1].charAt(0);

        return `${primera}${ultima}`.toUpperCase();
    }
}
