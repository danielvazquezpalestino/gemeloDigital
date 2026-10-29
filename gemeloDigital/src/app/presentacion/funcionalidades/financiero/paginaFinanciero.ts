import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { estimarFinanciero } from '../../../aplicacion/casosDeUso/estimarFinanciero.casoUso';
import { resultadoFinanciero } from '../../../dominio/entidades/resultadoFinanciero.entidad';

/**
 * Sección financiera.
 *
 * Estima VPN, TIR, ROI y periodo de recuperación de una instalación solar a
 * partir de la inversión, el ahorro y el horizonte de evaluación.
 */
@Component({
    selector: 'gd-pagina-financiero',
    imports: [ReactiveFormsModule, DecimalPipe],
    templateUrl: './paginaFinanciero.html',
    styleUrl: './paginaFinanciero.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class paginaFinanciero
{
    private readonly casoUso = inject(estimarFinanciero);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly formulario = this.constructorFormulario.group({
        inversionInicial: this.constructorFormulario.control(150000, [
            Validators.required,
            Validators.min(1),
        ]),
        ahorroAnual: this.constructorFormulario.control(28000, [
            Validators.required,
            Validators.min(0),
        ]),
        mantenimientoAnual: this.constructorFormulario.control(2500, [
            Validators.required,
            Validators.min(0),
        ]),
        horizonteAnios: this.constructorFormulario.control(20, [
            Validators.required,
            Validators.min(1),
            Validators.max(50),
        ]),
        tasaDescuento: this.constructorFormulario.control(0.08, [
            Validators.required,
            Validators.min(0),
            Validators.max(1),
        ]),
    });

    protected readonly resultado = signal<resultadoFinanciero | null>(null);
    protected readonly cargando = signal(false);
    protected readonly mensajeError = signal<string | null>(null);

    protected async estimar(): Promise<void>
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
            const { inversionInicial, ahorroAnual, mantenimientoAnual, horizonteAnios, tasaDescuento } =
                this.formulario.getRawValue();
            this.resultado.set(
                await this.casoUso.ejecutar(
                    inversionInicial,
                    ahorroAnual,
                    horizonteAnios,
                    tasaDescuento,
                    mantenimientoAnual,
                ),
            );
        }
        catch (excepcion)
        {
            this.resultado.set(null);
            this.mensajeError.set(
                excepcion instanceof Error ? excepcion.message : 'No se pudo estimar la rentabilidad.',
            );
        }
        finally
        {
            this.cargando.set(false);
        }
    }
}
