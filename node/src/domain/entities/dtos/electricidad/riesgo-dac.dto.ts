import TipoTarifa = require('../../tipo-tarifa');
import ValidacionEntrada = require('../validacion-entrada');

/**
 * Parámetros para evaluar el riesgo de caer en la tarifa DAC.
 *
 * `mesesHistoricos` es opcional y por defecto vale 12. La regla del dominio
 * exige al menos 6 meses para emitir un nivel de riesgo.
 */
class DtoRiesgoDac
{
    private constructor(
        public readonly tipoTarifa: TipoTarifa,
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

        const [errorTipoTarifa, tipoTarifa] = DtoRiesgoDac.leerTipoTarifa(objeto['tipoTarifa']);

        if (errorTipoTarifa || tipoTarifa === undefined)
        {
            return [errorTipoTarifa, undefined];
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

        return [
            undefined,
            new DtoRiesgoDac(tipoTarifa, consumoPromedioMensualKwh, mesesHistoricos),
        ];
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
            return ['El parámetro "tipoTarifa" debe ser PDBT, DAC o GDBT', undefined];
        }

        return [undefined, tipoTarifa as TipoTarifa];
    }
}

export = DtoRiesgoDac;
