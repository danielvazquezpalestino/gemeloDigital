import ValidacionEntrada = require('../validacion-entrada');

class DtoEstimarFactura
{
    private constructor(
        public readonly tarifa: string,
        public readonly consumoKwh: number,
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

        const [errorTarifa, tarifa] = ValidacionEntrada.leerTextoRequerido(objeto['tarifa'], 'tarifa', 20);

        if (errorTarifa || tarifa === undefined)
        {
            return [errorTarifa, undefined];
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

        return [undefined, new DtoEstimarFactura(tarifa.toUpperCase(), consumoKwh)];
    }
}

export = DtoEstimarFactura;
