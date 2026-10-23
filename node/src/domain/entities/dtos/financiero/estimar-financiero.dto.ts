import ValidacionEntrada = require('../validacion-entrada');

class DtoEstimarFinanciero
{
    private constructor(
        public readonly inversionInicial: number,
        public readonly ahorroAnual: number,
        public readonly mantenimientoAnual: number,
        public readonly horizonteAnios: number,
        public readonly tasaDescuento: number,
    )
    {
    }

    static crear(datos: unknown): [string | undefined, DtoEstimarFinanciero | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(datos);

        if (!objeto)
        {
            return ['Los datos de la estimación financiera son inválidos', undefined];
        }

        const [errorInversion, inversionInicial] = ValidacionEntrada.leerNumero(
            objeto['inversionInicial'],
            'inversionInicial',
            { minimo: 0, maximo: 1000000000, incluirMinimo: false },
        );

        if (errorInversion || inversionInicial === undefined)
        {
            return [errorInversion, undefined];
        }

        const [errorAhorro, ahorroAnual] = ValidacionEntrada.leerNumero(
            objeto['ahorroAnual'],
            'ahorroAnual',
            { minimo: 0, maximo: 1000000000 },
        );

        if (errorAhorro || ahorroAnual === undefined)
        {
            return [errorAhorro, undefined];
        }

        const [errorMantenimiento, mantenimientoAnual] = ValidacionEntrada.leerNumeroOpcional(
            objeto['mantenimientoAnual'],
            'mantenimientoAnual',
            { minimo: 0, maximo: 1000000000, porDefecto: 0 },
        );

        if (errorMantenimiento || mantenimientoAnual === undefined)
        {
            return [errorMantenimiento, undefined];
        }

        const [errorHorizonte, horizonteAnios] = ValidacionEntrada.leerNumero(
            objeto['horizonteAnios'],
            'horizonteAnios',
            { minimo: 1, maximo: 50, entero: true },
        );

        if (errorHorizonte || horizonteAnios === undefined)
        {
            return [errorHorizonte, undefined];
        }

        const [errorTasa, tasaDescuento] = ValidacionEntrada.leerNumero(
            objeto['tasaDescuento'],
            'tasaDescuento',
            { minimo: 0, maximo: 1 },
        );

        if (errorTasa || tasaDescuento === undefined)
        {
            return [errorTasa, undefined];
        }

        return [undefined, new DtoEstimarFinanciero(
            inversionInicial,
            ahorroAnual,
            mantenimientoAnual,
            horizonteAnios,
            tasaDescuento,
        )];
    }
}

export = DtoEstimarFinanciero;
