import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { almacenamientoSesion } from '../../../aplicacion/puertos/almacenamientoSesion';
import { obtenerEstadisticasMunicipios } from '../../../aplicacion/casosDeUso/obtenerEstadisticasMunicipios.casoUso';
import { estadisticasMunicipios } from '../../../dominio/entidades/estadisticasMunicipios.entidad';
import { usuario } from '../../../dominio/entidades/usuario.entidad';

/**
 * Panel de inicio protegido.
 *
 * Vive dentro del armazón compartido, así que no repite encabezado ni
 * navegación: muestra el resumen de la sesión, las estadísticas agregadas que
 * expone la API y los accesos a los módulos del gemelo digital.
 */
@Component({
    selector: 'gd-panel-inicio',
    imports: [ReactiveFormsModule, RouterLink, DecimalPipe, DatePipe],
    templateUrl: './panelInicio.html',
    styleUrl: './panelInicio.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'gd-pagina-panel' },
})
export class panelInicio
{
    private readonly almacenamiento = inject(almacenamientoSesion);
    private readonly casoUsoEstadisticas = inject(obtenerEstadisticasMunicipios);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly usuarioActual = signal<usuario | null>(
        this.almacenamiento.obtener()?.usuario ?? null,
    );

    protected readonly formulario = this.constructorFormulario.group({
        municipioId: this.constructorFormulario.control<number | null>(null, [Validators.min(1)]),
        periodoDias: this.constructorFormulario.control<number | null>(null, [
            Validators.min(1),
            Validators.max(3650),
        ]),
    });

    protected readonly estadisticas = signal<estadisticasMunicipios | null>(null);
    protected readonly cargando = signal(false);
    protected readonly mensajeError = signal<string | null>(null);

    protected readonly modulos = [
        {
            ruta: '/panel/produccion-solar',
            titulo: 'Producción solar',
            descripcion: 'Radiación del sitio, producción estimada y catálogo de paneles.',
        },
        {
            ruta: '/panel/clima',
            titulo: 'Clima',
            descripcion: 'Pronóstico diario por coordenada para planear la generación.',
        },
        {
            ruta: '/panel/tarifas',
            titulo: 'Tarifas y consumo',
            descripcion: 'Catálogo de tarifas, estimación de factura y riesgo DAC.',
        },
        {
            ruta: '/panel/incentivos',
            titulo: 'Incentivos',
            descripcion: 'Programas disponibles y evaluación de elegibilidad.',
        },
        {
            ruta: '/panel/financiero',
            titulo: 'Financiero',
            descripcion: 'VPN, TIR, ROI y periodo de recuperación del proyecto.',
        },
        {
            ruta: '/panel/simulaciones',
            titulo: 'Simulaciones',
            descripcion: 'Registra escenarios, consulta el historial y recalcula.',
        },
    ] as const;

    constructor()
    {
        void this.cargarEstadisticas();
    }

    protected async cargarEstadisticas(): Promise<void>
    {
        this.mensajeError.set(null);

        if (this.formulario.invalid)
        {
            this.formulario.markAllAsTouched();
            return;
        }

        this.cargando.set(true);

        try
        {
            const { municipioId, periodoDias } = this.formulario.getRawValue();
            this.estadisticas.set(
                await this.casoUsoEstadisticas.ejecutar(municipioId, periodoDias),
            );
        }
        catch (excepcion)
        {
            this.estadisticas.set(null);
            this.mensajeError.set(
                excepcion instanceof Error
                    ? excepcion.message
                    : 'No se pudieron cargar las estadísticas.',
            );
        }
        finally
        {
            this.cargando.set(false);
        }
    }
}
