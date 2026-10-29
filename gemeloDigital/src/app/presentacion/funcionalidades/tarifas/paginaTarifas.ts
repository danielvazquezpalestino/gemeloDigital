import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DecimalPipe, LowerCasePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { estimarFacturaElectrica } from '../../../aplicacion/casosDeUso/estimarFacturaElectrica.casoUso';
import { evaluarRiesgoDac } from '../../../aplicacion/casosDeUso/evaluarRiesgoDac.casoUso';
import { listarTarifasElectricas } from '../../../aplicacion/casosDeUso/listarTarifasElectricas.casoUso';
import { catalogoTarifas } from '../../../dominio/entidades/catalogoTarifas.entidad';
import { facturaEstimada } from '../../../dominio/entidades/facturaEstimada.entidad';
import { riesgoDac } from '../../../dominio/entidades/riesgoDac.entidad';
import { nivelRiesgoDac } from '../../../dominio/objetosValor/nivelRiesgoDac';
import { periodoFacturacion } from '../../../dominio/objetosValor/periodoFacturacion';
import { tipoTarifa } from '../../../dominio/objetosValor/tipoTarifa';

/**
 * Sección de tarifas y consumo eléctrico.
 *
 * Reúne el catálogo de tarifas, la estimación de factura y el riesgo de caer
 * en la tarifa DAC.
 */
@Component({
    selector: 'gd-pagina-tarifas',
    imports: [ReactiveFormsModule, DecimalPipe, LowerCasePipe],
    templateUrl: './paginaTarifas.html',
    styleUrl: './paginaTarifas.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class paginaTarifas
{
    private readonly casoUsoTarifas = inject(listarTarifasElectricas);
    private readonly casoUsoFactura = inject(estimarFacturaElectrica);
    private readonly casoUsoRiesgo = inject(evaluarRiesgoDac);
    private readonly constructorFormulario = inject(NonNullableFormBuilder);

    protected readonly tiposTarifa: readonly tipoTarifa[] = ['PDBT', 'DAC', 'GDBT'];
    protected readonly periodos: readonly periodoFacturacion[] = [
        'MENSUAL',
        'BIMESTRAL',
        'TRIMESTRAL',
        'SEMESTRAL',
        'ANUAL',
    ];

    protected readonly formularioFactura = this.constructorFormulario.group({
        tipoTarifa: this.constructorFormulario.control<tipoTarifa>('PDBT', [Validators.required]),
        consumoKwh: this.constructorFormulario.control(350, [
            Validators.required,
            Validators.min(1),
        ]),
        periodo: this.constructorFormulario.control<periodoFacturacion>('MENSUAL', [
            Validators.required,
        ]),
    });

    protected readonly formularioRiesgo = this.constructorFormulario.group({
        tipoTarifa: this.constructorFormulario.control<tipoTarifa>('PDBT', [Validators.required]),
        consumoPromedio: this.constructorFormulario.control(350, [
            Validators.required,
            Validators.min(1),
        ]),
        meses: this.constructorFormulario.control(12, [
            Validators.required,
            Validators.min(1),
            Validators.max(120),
        ]),
    });

    protected readonly catalogo = signal<catalogoTarifas | null>(null);
    protected readonly cargandoCatalogo = signal(false);
    protected readonly errorCatalogo = signal<string | null>(null);

    protected readonly factura = signal<facturaEstimada | null>(null);
    protected readonly cargandoFactura = signal(false);
    protected readonly errorFactura = signal<string | null>(null);

    protected readonly riesgo = signal<riesgoDac | null>(null);
    protected readonly cargandoRiesgo = signal(false);
    protected readonly errorRiesgo = signal<string | null>(null);

    constructor()
    {
        void this.cargarCatalogo();
    }

    protected async cargarCatalogo(): Promise<void>
    {
        this.cargandoCatalogo.set(true);
        this.errorCatalogo.set(null);

        try
        {
            this.catalogo.set(await this.casoUsoTarifas.ejecutar());
        }
        catch (excepcion)
        {
            this.catalogo.set(null);
            this.errorCatalogo.set(this.mensajeDe(excepcion, 'No se pudo cargar el catálogo.'));
        }
        finally
        {
            this.cargandoCatalogo.set(false);
        }
    }

    protected async estimarFactura(): Promise<void>
    {
        this.errorFactura.set(null);

        if (this.formularioFactura.invalid)
        {
            this.formularioFactura.markAllAsTouched();
            return;
        }

        this.cargandoFactura.set(true);

        try
        {
            const { tipoTarifa, consumoKwh, periodo } = this.formularioFactura.getRawValue();
            this.factura.set(await this.casoUsoFactura.ejecutar(tipoTarifa, consumoKwh, periodo));
        }
        catch (excepcion)
        {
            this.factura.set(null);
            this.errorFactura.set(this.mensajeDe(excepcion, 'No se pudo estimar la factura.'));
        }
        finally
        {
            this.cargandoFactura.set(false);
        }
    }

    protected async evaluarRiesgo(): Promise<void>
    {
        this.errorRiesgo.set(null);

        if (this.formularioRiesgo.invalid)
        {
            this.formularioRiesgo.markAllAsTouched();
            return;
        }

        this.cargandoRiesgo.set(true);

        try
        {
            const { tipoTarifa, consumoPromedio, meses } = this.formularioRiesgo.getRawValue();
            this.riesgo.set(
                await this.casoUsoRiesgo.ejecutar(tipoTarifa, consumoPromedio, meses),
            );
        }
        catch (excepcion)
        {
            this.riesgo.set(null);
            this.errorRiesgo.set(this.mensajeDe(excepcion, 'No se pudo evaluar el riesgo DAC.'));
        }
        finally
        {
            this.cargandoRiesgo.set(false);
        }
    }

    protected claseNivel(nivel: nivelRiesgoDac): string
    {
        switch (nivel)
        {
            case 'ALTO':
                return 'etiqueta etiqueta--riesgo';
            case 'MEDIO':
                return 'etiqueta etiqueta--alerta';
            case 'BAJO':
                return 'etiqueta etiqueta--ok';
            default:
                return 'etiqueta';
        }
    }

    private mensajeDe(excepcion: unknown, porDefecto: string): string
    {
        return excepcion instanceof Error ? excepcion.message : porDefecto;
    }
}
