import ValidacionEntrada = require('../validacion-entrada');

class DtoRiesgoDac
{
    private constructor(
        public readonly consumoPromedioMensualKwh: number,
        public readonly mesesHistoricos: number,
    )
    {
    }

    static crear(consulta: unknown): [string | undefined, DtoRiesgoDac | undefined]
    {
        const objeto = ValidacionEntrada.comoObjeto(consulta);

        if (!objeto)
        {
            return ['Los parámetros de evaluación son inválidos', undefined];
        }

        const [errorConsumo, consumoPromedioMensualKwh] = ValidacionEntrada.leerNumeroConsulta(
            objeto['consumoPromedioMensualKwh'],
            'consumoPromedioMensualKwh',
            { minimo: 0, maximo: 10000000, incluirMinimo: false },
        );

        if (errorConsumo || consumoPromedioMensualKwh === undefined)
        {
            return [errorConsumo, undefined];
        }

        const [errorMeses, mesesHistoricos] = ValidacionEntrada.leerNumeroConsulta(
            objeto['mesesHistoricos'],
            'mesesHistoricos',
            { minimo: 1, maximo: 120, porDefecto: 12, entero: true },
        );

        if (errorMeses || mesesHistoricos === undefined)
        {
            return [errorMeses, undefined];
        }

        return [undefined, new DtoRiesgoDac(consumoPromedioMensualKwh, mesesHistoricos)];
    }
}

export = DtoRiesgoDac;
