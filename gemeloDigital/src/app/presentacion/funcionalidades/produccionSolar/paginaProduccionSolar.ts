import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { calcularProduccionSolar } from '../../../aplicacion/casosDeUso/calcularProduccionSolar.casoUso';
import { listarPanelesSolares } from '../../../aplicacion/casosDeUso/listarPanelesSolares.casoUso';
import { obtenerRadiacionSolar } from '../../../aplicacion/casosDeUso/obtenerRadiacionSolar.casoUso';
import { catalogoPaneles } from '../../../dominio/entidades/catalogoPaneles.entidad';
import { produccionSolar } from '../../../dominio/entidades/produccionSolar.entidad';
import { radiacionSolar } from '../../../dominio/entidades/radiacionSolar.entidad';

/**
 * Sección de producción solar.
 *
 * Reúne la radiación del sitio, la producción estimada de un sistema y el
 * catálogo de paneles que ofrece la API.
 */
@Component({
    selector: 'gd-pagina-produccion-solar',
    imports: [ReactiveFormsModule, DecimalPipe],
    templateUrl: './paginaProduccionSolar.html',
    styleUrl: './paginaProduccionSolar.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class paginaProduccionSolar
{
    private readonly casoUsoRadiacion = inject(obtenerRadiacionSolar);
    private readonly casoUsoProduccion = inject(calcularProduccionSolar);
    private readonly casoUsoPaneles = inject(listarPanelesSolares);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly formularioSistema = this.constructorFormulario.group({
        latitud: this.constructorFormulario.control<number | null>(19.4326, [
            Validators.min(-90),
            Validators.max(90),
        ]),
        longitud: this.constructorFormulario.control<number | null>(-99.1332, [
            Validators.min(-180),
            Validators.max(180),
        ]),
        municipioId: this.constructorFormulario.control<number | null>(null, [Validators.min(1)]),
        capacidadKwp: this.constructorFormulario.control(3, [
            Validators.required,
            Validators.min(0.1),
        ]),
        eficiencia: this.constructorFormulario.control<number | null>(0.8, [
            Validators.min(0.01),
            Validators.max(1),
        ]),
    });

    protected readonly formularioPaneles = this.constructorFormulario.group({
        fabricante: this.constructorFormulario.control(''),
        potenciaMinima: this.constructorFormulario.control<number | null>(null, [
            Validators.min(1),
        ]),
    });

    protected readonly radiacion = signal<radiacionSolar | null>(null);
    protected readonly cargandoRadiacion = signal(false);
    protected readonly errorRadiacion = signal<string | null>(null);

    protected readonly produccion = signal<produccionSolar | null>(null);
    protected readonly cargandoProduccion = signal(false);
    protected readonly errorProduccion = signal<string | null>(null);

    protected readonly paneles = signal<catalogoPaneles | null>(null);
    protected readonly cargandoPaneles = signal(false);
    protected readonly errorPaneles = signal<string | null>(null);

    constructor()
    {
        void this.buscarPaneles();
    }

    protected async consultarRadiacion(): Promise<void>
    {
        this.errorRadiacion.set(null);

        if (this.formularioSistema.controls.latitud.invalid || this.formularioSistema.controls.longitud.invalid) {
            this.formularioSistema.markAllAsTouched();
            return;
        }

        this.cargandoRadiacion.set(true);

        try
        {
            const { latitud, longitud, municipioId } = this.formularioSistema.getRawValue();
            this.radiacion.set(
                await this.casoUsoRadiacion.ejecutar(latitud, longitud, municipioId),
            );
        }
        catch (excepcion)
        {
            this.radiacion.set(null);
            this.errorRadiacion.set(this.mensajeDe(excepcion, 'No se pudo consultar la radiación.'));
        }
        finally
        {
            this.cargandoRadiacion.set(false);
        }
    }

    protected async calcularProduccion(): Promise<void>
    {
        this.errorProduccion.set(null);

        if (this.formularioSistema.controls.capacidadKwp.invalid || this.formularioSistema.controls.eficiencia.invalid) {
            this.formularioSistema.markAllAsTouched();
            return;
        }

        this.cargandoProduccion.set(true);

        try
        {
            const { capacidadKwp, eficiencia, latitud, longitud, municipioId } =
                this.formularioSistema.getRawValue();
            this.produccion.set(
                await this.casoUsoProduccion.ejecutar(
                    capacidadKwp,
                    eficiencia,
                    latitud,
                    longitud,
                    municipioId,
                ),
            );
        }
        catch (excepcion)
        {
            this.produccion.set(null);
            this.errorProduccion.set(this.mensajeDe(excepcion, 'No se pudo calcular la producción.'));
        }
        finally
        {
            this.cargandoProduccion.set(false);
        }
    }

    protected async buscarPaneles(): Promise<void>
    {
        this.errorPaneles.set(null);
        this.cargandoPaneles.set(true);

        try
        {
            const { fabricante, potenciaMinima } = this.formularioPaneles.getRawValue();
            this.paneles.set(
                await this.casoUsoPaneles.ejecutar(
                    fabricante.trim() === '' ? null : fabricante,
                    potenciaMinima,
                ),
            );
        }
        catch (excepcion)
        {
            this.paneles.set(null);
            this.errorPaneles.set(this.mensajeDe(excepcion, 'No se pudo cargar el catálogo.'));
        }
        finally
        {
            this.cargandoPaneles.set(false);
        }
    }

    private mensajeDe(excepcion: unknown, porDefecto: string): string
    {
        return excepcion instanceof Error ? excepcion.message : porDefecto;
    }
}
