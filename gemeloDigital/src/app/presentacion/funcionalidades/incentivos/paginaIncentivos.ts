import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { consultarIncentivos } from '../../../aplicacion/casosDeUso/consultarIncentivos.casoUso';
import { evaluarElegibilidadIncentivos } from '../../../aplicacion/casosDeUso/evaluarElegibilidadIncentivos.casoUso';
import { beneficioIncentivo } from '../../../dominio/entidades/beneficioIncentivo.entidad';
import { consultaIncentivos } from '../../../dominio/entidades/consultaIncentivos.entidad';
import { evaluacionElegibilidadIncentivos } from '../../../dominio/entidades/evaluacionElegibilidadIncentivos.entidad';
import { estadoEvaluacionIncentivo } from '../../../dominio/objetosValor/estadoEvaluacionIncentivo';
import { estadoIncentivo } from '../../../dominio/objetosValor/estadoIncentivo';
import { tipoBeneficiario } from '../../../dominio/objetosValor/tipoBeneficiario';

/**
 * Sección de incentivos.
 *
 * Consulta el catálogo paginado y evalúa qué programas podrían corresponder a
 * un solicitante concreto.
 */
@Component({
    selector: 'gd-pagina-incentivos',
    imports: [ReactiveFormsModule, DatePipe],
    templateUrl: './paginaIncentivos.html',
    styleUrl: './paginaIncentivos.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class paginaIncentivos
{
    private readonly casoUsoConsulta = inject(consultarIncentivos);
    private readonly casoUsoElegibilidad = inject(evaluarElegibilidadIncentivos);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly tiposBeneficiario: readonly tipoBeneficiario[] = ['home', 'business'];
    protected readonly estados: readonly estadoIncentivo[] = [
        'active',
        'upcoming',
        'expired',
        'unverified',
    ];
    protected readonly limites: readonly number[] = [10, 20, 50];

    protected readonly formularioConsulta = this.constructorFormulario.group({
        tipoBeneficiario: this.constructorFormulario.control<tipoBeneficiario | ''>(''),
        municipio: this.constructorFormulario.control(''),
        estado: this.constructorFormulario.control<estadoIncentivo | ''>(''),
        limite: this.constructorFormulario.control(20, [Validators.required]),
    });

    protected readonly formularioElegibilidad = this.constructorFormulario.group({
        tipoBeneficiario: this.constructorFormulario.control<tipoBeneficiario>('home', [
            Validators.required,
        ]),
        municipio: this.constructorFormulario.control('', [Validators.required]),
        capacidadSistemaKw: this.constructorFormulario.control<number | null>(3, [
            Validators.min(0.01),
            Validators.max(100),
        ]),
        tipoInstalacion: this.constructorFormulario.control(''),
    });

    protected readonly consulta = signal<consultaIncentivos | null>(null);
    protected readonly cargandoConsulta = signal(false);
    protected readonly errorConsulta = signal<string | null>(null);
    protected readonly pagina = signal(1);

    protected readonly evaluacion = signal<evaluacionElegibilidadIncentivos | null>(null);
    protected readonly cargandoEvaluacion = signal(false);
    protected readonly errorEvaluacion = signal<string | null>(null);

    constructor()
    {
        void this.buscar();
    }

    protected async buscar(pagina = 1): Promise<void>
    {
        this.errorConsulta.set(null);
        this.cargandoConsulta.set(true);

        try
        {
            const { tipoBeneficiario, municipio, estado, limite } =
                this.formularioConsulta.getRawValue();
            const resultado = await this.casoUsoConsulta.ejecutar({
                tipoBeneficiario: tipoBeneficiario === '' ? null : tipoBeneficiario,
                municipio: municipio.trim() === '' ? null : municipio,
                estado: estado === '' ? null : estado,
                pagina,
                limite,
            });
            this.consulta.set(resultado);
            this.pagina.set(resultado.pagina);
        }
        catch (excepcion)
        {
            this.consulta.set(null);
            this.errorConsulta.set(this.mensajeDe(excepcion, 'No se pudo consultar el catálogo.'));
        }
        finally
        {
            this.cargandoConsulta.set(false);
        }
    }

    protected async evaluar(): Promise<void>
    {
        this.errorEvaluacion.set(null);

        if (this.formularioElegibilidad.invalid)
        {
            this.formularioElegibilidad.markAllAsTouched();
            return;
        }

        this.cargandoEvaluacion.set(true);

        try
        {
            const { tipoBeneficiario, municipio, capacidadSistemaKw, tipoInstalacion } =
                this.formularioElegibilidad.getRawValue();
            this.evaluacion.set(
                await this.casoUsoElegibilidad.ejecutar({
                    tipoBeneficiario,
                    municipio,
                    capacidadSistemaKw,
                    tipoInstalacion: tipoInstalacion.trim() === '' ? null : tipoInstalacion,
                }),
            );
        }
        catch (excepcion)
        {
            this.evaluacion.set(null);
            this.errorEvaluacion.set(
                this.mensajeDe(excepcion, 'No se pudo evaluar la elegibilidad.'),
            );
        }
        finally
        {
            this.cargandoEvaluacion.set(false);
        }
    }

    protected totalPaginas(): number
    {
        const consulta = this.consulta();
        return consulta === null ? 1 : Math.max(1, Math.ceil(consulta.total / consulta.limite));
    }

    protected claseEstado(estado: estadoEvaluacionIncentivo): string
    {
        switch (estado)
        {
            case 'eligible':
                return 'etiqueta etiqueta--ok';
            case 'potentially_eligible':
                return 'etiqueta etiqueta--alerta';
            case 'ineligible':
                return 'etiqueta etiqueta--riesgo';
            default:
                return 'etiqueta';
        }
    }

    protected etiquetaEstado(estado: estadoEvaluacionIncentivo): string
    {
        switch (estado)
        {
            case 'eligible':
                return 'Elegible';
            case 'potentially_eligible':
                return 'Potencialmente elegible';
            case 'ineligible':
                return 'No elegible';
            default:
                return 'Datos insuficientes';
        }
    }

    protected textoBeneficio(beneficio: beneficioIncentivo): string
    {
        if (beneficio.monto !== null)
        {
            return `${beneficio.monto.toLocaleString('es-MX')} ${beneficio.moneda}`;
        }

        if (beneficio.porcentaje !== null)
        {
            return `${beneficio.porcentaje} %`;
        }

        return beneficio.tipo;
    }

    private mensajeDe(excepcion: unknown, porDefecto: string): string
    {
        return excepcion instanceof Error ? excepcion.message : porDefecto;
    }
}
