import DtoElegibilidadIncentivo = require('../entities/dtos/incentivos/evaluar-elegibilidad.dto');
import Incentivo = require('../entities/incentivo.entidad');
import RequisitoIncentivo = require('../entities/requisito-incentivo.entidad');
import ResultadoElegibilidad = require('../entities/resultado-elegibilidad.entidad');

/**
 * Evalúa únicamente los requisitos configurados en el catálogo.
 *
 * Si falta un dato obligatorio, la elegibilidad es `null` (no se puede
 * determinar), nunca `false` por suposición. Las reglas del catálogo actual
 * son de DEMOSTRACIÓN y no representan programas oficiales.
 */
class EvaluadorElegibilidadIncentivos
{
    evaluar(incentivo: Incentivo, dto: DtoElegibilidadIncentivo): ResultadoElegibilidad
    {
        const datos = dto.comoDatos();
        const razones: string[] = [];
        const requisitosFaltantes: string[] = [];

        for (const requisito of incentivo.requisitos)
        {
            const valorActual = datos[requisito.campo];

            if (valorActual === undefined)
            {
                requisitosFaltantes.push(`Falta el dato "${requisito.campo}" para evaluar: ${requisito.descripcion}`);
                continue;
            }

            if (!EvaluadorElegibilidadIncentivos.cumple(valorActual, requisito))
            {
                razones.push(`No cumple: ${requisito.descripcion} (valor recibido: ${valorActual})`);
            }
        }

        const elegible = requisitosFaltantes.length > 0 ? null : razones.length === 0;

        return new ResultadoElegibilidad(
            incentivo.id,
            incentivo.nombre,
            elegible,
            razones,
            requisitosFaltantes,
            incentivo.esDemostracion,
            false,
            'La elegibilidad se calcula con requisitos de DEMOSTRACIÓN configurados y no constituye una determinación oficial.',
        );
    }

    private static cumple(valorActual: string | number, requisito: RequisitoIncentivo): boolean
    {
        if (requisito.operador === 'igual')
        {
            return String(valorActual).toUpperCase() === String(requisito.valor).toUpperCase();
        }

        if (typeof valorActual !== 'number' || typeof requisito.valor !== 'number')
        {
            return false;
        }

        if (requisito.operador === 'mayor_igual')
        {
            return valorActual >= requisito.valor;
        }

        if (requisito.operador === 'menor_igual')
        {
            return valorActual <= requisito.valor;
        }

        return false;
    }
}

export = EvaluadorElegibilidadIncentivos;
