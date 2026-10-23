import PeriodoFacturacion = require('../../periodo-facturacion');
import TipoTarifa = require('../../tipo-tarifa');
import ValidacionEntrada = require('../validacion-entrada');

/**
 * Datos de entrada para estimar una factura eléctrica.
 *
 * `consumoKwh` se interpreta como el total del periodo indicado. El DTO no
 * convierte el consumo entre periodos ni aplica cargos oficiales.
 */
class DtoEstimarFactura
{
    private constructor(
        public readonly tipoTarifa: TipoTarifa,
        public readonly consumoKwh: number,
        public readonly periodo: PeriodoFacturacion,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoEstimarFactura | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(datos);

        if (!objeto)
        {
            return ['Los datos de la estimación son inválidos', undefined];
        }

        const [errorTipoTarifa, tipoTarifa] = DtoEstimarFactura.leerTipoTarifa(objeto['tipoTarifa']);

        if (errorTipoTarifa || tipoTarifa === undefined)
        {
            return [errorTipoTarifa, undefined];
        }

        const [errorConsumo, consumoKwh] = ValidacionEntrada.leerNumero(
            objeto['consumoKwh'],
            'consumoKwh',
            { minimo: 0, maximo: 10000000, incluirMinimo: false },
        );

        if (errorConsumo || consumoKwh === undefined)
        {
            return [errorConsumo, undefined];
        }

        const [errorPeriodo, periodo] = DtoEstimarFactura.leerPeriodo(objeto['periodo']);

        if (errorPeriodo || periodo === undefined)
        {
            return [errorPeriodo, undefined];
        }

        return [undefined, new DtoEstimarFactura(tipoTarifa, consumoKwh, periodo)];
    }

    private static leerTipoTarifa(valor: unknown): [string | undefined, TipoTarifa | undefined]
    {
        const [error, texto] = ValidacionEntrada.leerTextoRequerido(valor, 'tipoTarifa', 20);

        if (error || texto === undefined)
        {
            return [error, undefined];
        }

        const tipoTarifa = (Object.values(TipoTarifa) as string[])
            .find((tipo) => tipo === texto.toUpperCase());

        if (tipoTarifa === undefined)
        {
            return ['El campo "tipoTarifa" debe ser PDBT, DAC o GDBT', undefined];
        }

        return [undefined, tipoTarifa as TipoTarifa];
    }

    private static leerPeriodo(valor: unknown): [string | undefined, PeriodoFacturacion | undefined]
    {
        const [error, texto] = ValidacionEntrada.leerTextoOpcional(valor, 'periodo', 20);

        if (error)
        {
            return [error, undefined];
        }

        if (texto === undefined)
        {
            return [undefined, PeriodoFacturacion.MENSUAL];
        }

        const periodo = (Object.values(PeriodoFacturacion) as string[])
            .find((candidato) => candidato === texto.toUpperCase());

        if (periodo === undefined)
        {
            return [
                'El campo "periodo" debe ser MENSUAL, BIMESTRAL, TRIMESTRAL, SEMESTRAL o ANUAL',
                undefined,
            ];
        }

        return [undefined, periodo as PeriodoFacturacion];
    }
}

export = DtoEstimarFactura;
