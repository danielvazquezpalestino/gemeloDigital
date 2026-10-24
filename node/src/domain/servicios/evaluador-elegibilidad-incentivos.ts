import DatosSolicitudIncentivo = require('../entities/datos-solicitud-incentivo.entidad');
import EstadoEvaluacion = require('../entities/estado-evaluacion');
import Incentivo = require('../entities/incentivo.entidad');
import EvaluacionIncentivo = require('../entities/evaluacion-incentivo.entidad');
import RequisitoIncentivo = require('../entities/requisito-incentivo.entidad');

/**
 * Evaluador de elegibilidad de los programas de incentivos solares.
 *
 * Compara los datos del solicitante con los requisitos documentados de cada
 * programa. No inventa requisitos legales ni administrativos: si un programa no
 * tiene sus requisitos completos o verificados, la evaluación se detalla como
 * `insufficient_data`.
 */
class EvaluadorElegibilidadIncentivos
{
    /**
     * Evalúa cada incentivo contra los datos del solicitante.
     */
    evaluar(incentivos: readonly Incentivo[], datos: DatosSolicitudIncentivo): EvaluacionIncentivo[]
    {
        return incentivos.map((incentivo) => EvaluadorElegibilidadIncentivos.evaluarIncentivo(incentivo, datos));
    }

    /**
     * Evalúa un único incentivo contra los datos del solicitante.
     */
    private static evaluarIncentivo(incentivo: Incentivo, datos: DatosSolicitudIncentivo): EvaluacionIncentivo
    {
        const requisitosCumplidos: RequisitoIncentivo[] = [];
        const requisitosPendientes: RequisitoIncentivo[] = [];
        const datosFaltantes: string[] = [];
        const requisitosNoCumplidos: RequisitoIncentivo[] = [];

        let estado: EstadoEvaluacion;
        let explicacion: string;

        if (incentivo.municipioId !== null && datos.municipioId !== null && incentivo.municipioId !== datos.municipioId)
        {
            estado = EstadoEvaluacion.INELIGIBLE;

            explicacion =
                `El programa "${incentivo.nombre}" está orientado al municipio con clave ` +
                `${incentivo.municipioId}, mientras que el solicitante se ubica en el municipio ` +
                `${datos.municipioId}.`;
        }
        else if (!incentivo.verificado)
        {
            estado = EstadoEvaluacion.INSUFFICIENT_DATA;

            explicacion =
                `El programa "${incentivo.nombre}" no tiene verificados sus requisitos por el organismo ` +
                `competente; no se puede emitir una evaluación concluyente.`;
        }
        else
        {
            const requeridos = incentivo.requisitos.filter((requisito) => requisito.requerido);
            const verificados = requeridos.filter((requisito) => requisito.verificado);
            const pendientes = requeridos.filter((requisito) => !requisito.verificado);

            for (const requisito of verificados)
            {
                const cumple = EvaluadorElegibilidadIncentivos.cumpleRequisito(requisito, datos);

                if (cumple === null)
                {
                    datosFaltantes.push(requisito.campo);
                }
                else if (cumple)
                {
                    requisitosCumplidos.push(requisito);
                }
                else
                {
                    requisitosNoCumplidos.push(requisito);
                }
            }

            requisitosPendientes.push(...pendientes);

            if (datosFaltantes.length > 0)
            {
                estado = EstadoEvaluacion.INSUFFICIENT_DATA;

                const camposFaltantes = datosFaltantes.length === 1
                    ? datosFaltantes[0] ?? 'uno de los datos requeridos'
                    : `${datosFaltantes.slice(0, -1).join(', ')}, y ${datosFaltantes[datosFaltantes.length - 1]}`;

                explicacion =
                    `Faltan datos del solicitante para evaluar los requisitos del programa: ` +
                    `${camposFaltantes}.`;
            }
            else if (requisitosNoCumplidos.length > 0)
            {
                estado = EstadoEvaluacion.INELIGIBLE;

                explicacion =
                    `El solicitante no cumple con los requisitos verificados del programa: ` +
                    `${requisitosNoCumplidos.map((requisito) => requisito.campo).join(', ')}.`;
            }
            else if (pendientes.length > 0)
            {
                estado = EstadoEvaluacion.POTENTIALLY_ELIGIBLE;

                explicacion =
                    `El solicitante cumple con los requisitos verificados del programa, pero este aún tiene ` +
                    `requisitos adicionales pendientes de verificación.`;
            }
            else
            {
                estado = EstadoEvaluacion.ELEGIBLE;

                explicacion =
                    `El solicitante cumple con los requisitos documentados del programa "${incentivo.nombre}".`;
            }
        }

        return new EvaluacionIncentivo(incentivo, estado, requisitosCumplidos, requisitosPendientes, datosFaltantes, explicacion);
    }

    /**
     * Determina si un requisito documentado se cumple con los datos del
     * solicitante. Devuelve `null` cuando el requisito existe pero los datos
     * disponibles no alcanzan para evaluarlo.
     */
    private static cumpleRequisito(requisito: RequisitoIncentivo, datos: DatosSolicitudIncentivo): boolean | null
    {
        const campo = requisito.campo.toLowerCase();

        if (campo.includes('capacidad'))
        {
            if (datos.capacidadKw === null || requisito.valor === null)
            {
                return null;
            }

            return datos.capacidadKw >= requisito.valor;
        }

        if (campo.includes('instalacion'))
        {
            return datos.tipoInstalacion !== null;
        }

        // Requisitos de otros dominios (consumo, antigüedad, etc.) que todavía no
        // cuentan con un dato del solicitante no pueden evaluarse.
        return null;
    }
}

export = EvaluadorElegibilidadIncentivos;
