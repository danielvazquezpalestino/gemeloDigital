import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { almacenamientoSesion } from '../../../aplicacion/puertos/almacenamientoSesion';
import { cerrarSesion as cerrarSesionCasoUso } from '../../../aplicacion/casosDeUso/cerrarSesion.casoUso';
import { usuario } from '../../../dominio/entidades/usuario.entidad';

/**
 * Panel de inicio protegido.
 *
 * Por ahora confirma la sesión activa y permite cerrarla; las tarjetas de
 * monitoreo se conectarán a los módulos del gemelo digital más adelante.
 */
@Component({
    selector: 'gd-panel-inicio',
    templateUrl: './panelInicio.html',
    styleUrl: './panelInicio.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'gd-pagina-panel' },
})
export class panelInicio
{
    private readonly casoUsoCerrarSesion = inject(cerrarSesionCasoUso);
    private readonly almacenamiento = inject(almacenamientoSesion);
    private readonly enrutador = inject(Router);

    protected readonly usuarioActual = signal<usuario | null>(
        this.almacenamiento.obtener()?.usuario ?? null,
    );

    protected async cerrar(): Promise<void>
    {
        this.casoUsoCerrarSesion.ejecutar();
        await this.enrutador.navigateByUrl('/iniciar-sesion');
    }
}
