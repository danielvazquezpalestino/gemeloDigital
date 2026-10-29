import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { obtenerPronosticoMeteorologico } from '../../../aplicacion/casosDeUso/obtenerPronosticoMeteorologico.casoUso';
import { pronostico } from '../../../dominio/entidades/pronostico.entidad';

/**
 * Sección de clima.
 *
 * Consulta el pronóstico meteorológico de una coordenada y muestra el detalle
 * diario devuelto por la API.
 */
@Component({
    selector: 'gd-pagina-clima',
    imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
    templateUrl: './paginaClima.html',
    styleUrl: './paginaClima.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class paginaClima
{
    private readonly casoUso = inject(obtenerPronosticoMeteorologico);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly formulario = this.constructorFormulario.group({
        latitud: this.constructorFormulario.control(19.4326, [
            Validators.required,
            Validators.min(-90),
            Validators.max(90),
        ]),
        longitud: this.constructorFormulario.control(-99.1332, [
            Validators.required,
            Validators.min(-180),
            Validators.max(180),
        ]),
        dias: this.constructorFormulario.control(7, [
            Validators.required,
            Validators.min(1),
            Validators.max(16),
        ]),
    });

    protected readonly cargando = signal(false);
    protected readonly mensajeError = signal<string | null>(null);
    protected readonly pronostico = signal<pronostico | null>(null);

    protected async consultar(): Promise<void>
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
            const { latitud, longitud, dias } = this.formulario.getRawValue();
            this.pronostico.set(await this.casoUso.ejecutar(latitud, longitud, dias));
        }
        catch (excepcion)
        {
            this.pronostico.set(null);
            this.mensajeError.set(
                excepcion instanceof Error ? excepcion.message : 'No se pudo consultar el clima.',
            );
        }
        finally
        {
            this.cargando.set(false);
        }
    }
}
