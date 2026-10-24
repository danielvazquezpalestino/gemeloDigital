import express = require('express');
import DtoConsultarIncentivos = require('../../domain/entities/dtos/incentivos/consultar-incentivos.dto');
import DtoEvaluarElegibilidad = require('../../domain/entities/dtos/incentivos/evaluar-elegibilidad.dto');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import EvaluacionIncentivo = require('../../domain/entities/evaluacion-incentivo.entidad');
import RepositorioIncentivos = require('../../domain/repositories/repositorio-incentivos');

/**
 * Manejo HTTP del módulo de incentivos y programas de apoyo.
 *
 * Valida los parámetros de consulta, invoca el caso de uso y traduce el
 * resultado (o el error) a la respuesta JSON con el formato `{ "mensaje": "..." }`.
 */
class ControladorIncentivos
{
    constructor(private readonly repositorioIncentivos: RepositorioIncentivos)
    {
    }

    obtenerIncentivos = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoConsultarIncentivos.crear(req.query);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los parámetros de consulta son inválidos' });
        }

        try
        {
            const historial = await this.repositorioIncentivos.listar(dto);

            return res.status(200).json
            ({
                mensaje: 'Incentivos obtenidos correctamente',
                total: historial.total,
                pagina: historial.pagina,
                limite: historial.limite,
                incentivos: historial.incentivos,
            });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudieron obtener los incentivos');
        }
    }

    evaluarElegibilidad = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoEvaluarElegibilidad.crear(req.query);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los parámetros de consulta son inválidos' });
        }

        try
        {
            const evaluaciones = await this.repositorioIncentivos.evaluarElegibilidad(dto);

            const datos = {
                beneficiaryType: dto.beneficiaryType,
                municipality: dto.municipality,
                systemCapacityKw: dto.systemCapacityKw,
                installationType: dto.installationType,
            };

            return res.status(200).json
            ({
                mensaje: 'Evaluación de elegibilidad solicitada correctamente',
                datos,
                fechaEvaluacion: new Date().toISOString(),
                evaluaciones,
            });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo evaluar la elegibilidad de los incentivos');
        }
    }

    /**
     * Traduce una excepción a la respuesta HTTP.
     *
     * El detalle real solo se registra en el servidor; al cliente se le entrega
     * un mensaje en español y nunca un stack trace.
     */
    private responderError(error: unknown, res: express.Response, mensajeGenerico: string): express.Response
    {
        if (error instanceof ErrorPersonalizado)
        {
            if (error.codigoEstado >= 500)
            {
                console.error('Error interno en el módulo de incentivos:', error);
            }

            return res.status(error.codigoEstado).json({ mensaje: error.message });
        }

        console.error('Error inesperado en el módulo de incentivos:', error);

        return res.status(500).json({ mensaje: mensajeGenerico });
    }
}

export = ControladorIncentivos;
