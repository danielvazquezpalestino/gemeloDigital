import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { crearSimulacionSolar } from '../../../aplicacion/casosDeUso/crearSimulacionSolar.casoUso';
import { eliminarSimulacionSolar } from '../../../aplicacion/casosDeUso/eliminarSimulacionSolar.casoUso';
import { obtenerHistorialSimulaciones } from '../../../aplicacion/casosDeUso/obtenerHistorialSimulaciones.casoUso';
import { obtenerSimulacionSolar } from '../../../aplicacion/casosDeUso/obtenerSimulacionSolar.casoUso';
import { recalcularSimulacionSolar } from '../../../aplicacion/casosDeUso/recalcularSimulacionSolar.casoUso';
import { consultaSimulaciones } from '../../../dominio/entidades/consultaSimulaciones.entidad';
import { simulacionSolar } from '../../../dominio/entidades/simulacionSolar.entidad';
import { tipoTarifa } from '../../../dominio/objetosValor/tipoTarifa';

/**
 * Sección de simulaciones.
 *
 * Permite registrar una simulación, consultar el historial paginado y operar
 * sobre cada registro: ver el detalle, recalcular o eliminar.
 */
@Component({
    selector: 'gd-pagina-simulaciones',
    imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
    templateUrl: './paginaSimulaciones.html',
    styleUrl: './paginaSimulaciones.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class paginaSimulaciones
{
    private readonly casoUsoCrear = inject(crearSimulacionSolar);
    private readonly casoUsoHistorial = inject(obtenerHistorialSimulaciones);
    private readonly casoUsoObtener = inject(obtenerSimulacionSolar);
    private readonly casoUsoRecalcular = inject(recalcularSimulacionSolar);
    private readonly casoUsoEliminar = inject(eliminarSimulacionSolar);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly tiposTarifa: readonly tipoTarifa[] = ['PDBT', 'DAC', 'GDBT'];
    protected readonly limites: readonly number[] = [10, 20, 50];

    protected readonly formularioCrear = this.constructorFormulario.group({
        municipioId: this.constructorFormulario.control(1, [Validators.required, Validators.min(1)]),
        consumoKwh: this.constructorFormulario.control(350, [
            Validators.required,
            Validators.min(1),
        ]),
        tarifaCfe: this.constructorFormulario.control(2.8, [
            Validators.required,
            Validators.min(0.01),
        ]),
        areaDisponibleM2: this.constructorFormulario.control<number | null>(null, [
            Validators.min(0.01),
        ]),
        tipoTarifa: this.constructorFormulario.control<tipoTarifa>('PDBT', [Validators.required]),
        incluyeBaterias: this.constructorFormulario.control(false),
    });

    protected readonly formularioFiltros = this.constructorFormulario.group({
        municipioId: this.constructorFormulario.control<number | null>(null, [Validators.min(1)]),
        limite: this.constructorFormulario.control(10, [Validators.required]),
    });

    protected readonly formularioRecalculo = this.constructorFormulario.group({
        municipioId: this.constructorFormulario.control(1, [Validators.required, Validators.min(1)]),
        consumoKwh: this.constructorFormulario.control(350, [
            Validators.required,
            Validators.min(1),
        ]),
        tarifaCfe: this.constructorFormulario.control(2.8, [
            Validators.required,
            Validators.min(0.01),
        ]),
        areaDisponibleM2: this.constructorFormulario.control<number | null>(null, [
            Validators.min(0.01),
        ]),
        tipoTarifa: this.constructorFormulario.control<tipoTarifa>('PDBT', [Validators.required]),
        incluyeBaterias: this.constructorFormulario.control(false),
    });

    protected readonly historial = signal<consultaSimulaciones | null>(null);
    protected readonly cargandoHistorial = signal(false);
    protected readonly errorHistorial = signal<string | null>(null);

    protected readonly creando = signal(false);
    protected readonly errorCrear = signal<string | null>(null);
    protected readonly mensajeExito = signal<string | null>(null);

    protected readonly seleccionada = signal<simulacionSolar | null>(null);
    protected readonly cargandoDetalle = signal(false);
    protected readonly errorDetalle = signal<string | null>(null);
    protected readonly recalculando = signal(false);
    protected readonly eliminando = signal(false);
    protected readonly confirmandoEliminar = signal(false);

    constructor()
    {
        void this.cargarHistorial();
    }

    protected async cargarHistorial(pagina = 1): Promise<void>
    {
        this.errorHistorial.set(null);
        this.cargandoHistorial.set(true);

        try
        {
            const { municipioId, limite } = this.formularioFiltros.getRawValue();
            this.historial.set(
                await this.casoUsoHistorial.ejecutar({ municipioId, pagina, limite }),
            );
        }
        catch (excepcion)
        {
            this.historial.set(null);
            this.errorHistorial.set(
                this.mensajeDe(excepcion, 'No se pudo cargar el historial.'),
            );
        }
        finally
        {
            this.cargandoHistorial.set(false);
        }
    }

    protected async crear(): Promise<void>
    {
        this.errorCrear.set(null);
        this.mensajeExito.set(null);

        if (this.formularioCrear.invalid)
        {
            this.formularioCrear.markAllAsTouched();
            return;
        }

        this.creando.set(true);

        try
        {
            const datos = this.formularioCrear.getRawValue();
            const creada = await this.casoUsoCrear.ejecutar(datos);
            this.mensajeExito.set(`Simulación #${creada.id} registrada correctamente.`);
            this.seleccionar(creada);
            await this.cargarHistorial();
        }
        catch (excepcion)
        {
            this.errorCrear.set(
                this.mensajeDe(excepcion, 'No se pudo registrar la simulación.'),
            );
        }
        finally
        {
            this.creando.set(false);
        }
    }

    protected async verDetalle(id: number): Promise<void>
    {
        this.errorDetalle.set(null);
        this.confirmandoEliminar.set(false);
        this.cargandoDetalle.set(true);

        try
        {
            this.seleccionar(await this.casoUsoObtener.ejecutar(id));
        }
        catch (excepcion)
        {
            this.errorDetalle.set(
                this.mensajeDe(excepcion, 'No se pudo obtener la simulación.'),
            );
        }
        finally
        {
            this.cargandoDetalle.set(false);
        }
    }

    protected async recalcular(): Promise<void>
    {
        const simulacion = this.seleccionada();

        if (simulacion === null)
        {
            return;
        }

        this.errorDetalle.set(null);
        this.mensajeExito.set(null);

        if (this.formularioRecalculo.invalid)
        {
            this.formularioRecalculo.markAllAsTouched();
            return;
        }

        this.recalculando.set(true);

        try
        {
            const cambios = this.formularioRecalculo.getRawValue();
            this.seleccionar(await this.casoUsoRecalcular.ejecutar(simulacion.id, cambios));
            this.mensajeExito.set(`Simulación #${simulacion.id} recalculada.`);
            await this.cargarHistorial(this.historial()?.pagina ?? 1);
        }
        catch (excepcion)
        {
            this.errorDetalle.set(
                this.mensajeDe(excepcion, 'No se pudo recalcular la simulación.'),
            );
        }
        finally
        {
            this.recalculando.set(false);
        }
    }

    protected async eliminar(): Promise<void>
    {
        const simulacion = this.seleccionada();

        if (simulacion === null)
        {
            return;
        }

        this.errorDetalle.set(null);
        this.mensajeExito.set(null);
        this.eliminando.set(true);

        try
        {
            await this.casoUsoEliminar.ejecutar(simulacion.id);
            this.mensajeExito.set(`Simulación #${simulacion.id} eliminada.`);
            this.seleccionada.set(null);
            this.confirmandoEliminar.set(false);
            await this.cargarHistorial();
        }
        catch (excepcion)
        {
            this.errorDetalle.set(
                this.mensajeDe(excepcion, 'No se pudo eliminar la simulación.'),
            );
        }
        finally
        {
            this.eliminando.set(false);
        }
    }

    protected totalPaginas(): number
    {
        const historial = this.historial();
        return historial === null ? 1 : Math.max(1, Math.ceil(historial.total / historial.limite));
    }

    private seleccionar(simulacion: simulacionSolar): void
    {
        this.seleccionada.set(simulacion);
        this.formularioRecalculo.setValue({
            municipioId: simulacion.municipioId,
            consumoKwh: simulacion.consumoKwh,
            tarifaCfe: simulacion.tarifaCfe,
            areaDisponibleM2: simulacion.areaDisponibleM2,
            tipoTarifa: simulacion.tipoTarifa,
            incluyeBaterias: simulacion.incluyeBaterias,
        });
    }

    private mensajeDe(excepcion: unknown, porDefecto: string): string
    {
        return excepcion instanceof Error ? excepcion.message : porDefecto;
    }
}
