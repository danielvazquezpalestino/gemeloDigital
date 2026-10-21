import express = require('express');
import DtoConsultarSimulaciones = require('../../domain/entidades/dtos/simulaciones/consultar-simulaciones.dto');
import DtoCrearSimulacion = require('../../domain/entidades/dtos/simulaciones/crear-simulacion.dto');
import DtoIdSimulacion = require('../../domain/entidades/dtos/simulaciones/id-simulacion.dto');
import DtoRecalcularSimulacion = require('../../domain/entidades/dtos/simulaciones/recalcular-simulacion.dto');
import ErrorPersonalizado = require('../../domain/fuentes-datos/errores/error-personalizado');
import RepositorioSimulaciones = require('../../domain/repositorios/repositorio-simulaciones');

/**
 * Manejo HTTP del módulo de simulaciones solares.
 *
 * Valida el DTO de entrada, invoca el caso de uso y traduce el resultado (o el
 * error) a la respuesta JSON con el formato `{ "mensaje": "..." }`.
 */
class ControladorSimulaciones
{
    constructor(private readonly repositorioSimulaciones: RepositorioSimulaciones)
    {
    }

    crearSimulacion = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoCrearSimulacion.crear(req.body);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los datos de la simulación son inválidos' });
        }

        try
        {
            const simulacion = await this.repositorioSimulaciones.crear(dto);

            return res.status(201).json({ mensaje: 'Simulación solar creada correctamente', simulacion });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo crear la simulación solar');
        }
    }

    obtenerSimulacion = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoIdSimulacion.crear(req.params['id']);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'El identificador de la simulación es inválido' });
        }

        try
        {
            const simulacion = await this.repositorioSimulaciones.obtenerPorId(dto.id);

            return res.status(200).json({ mensaje: 'Simulación obtenida correctamente', simulacion });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo obtener la simulación solar');
        }
    }

    obtenerHistorial = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoConsultarSimulaciones.crear(req.query);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los parámetros de consulta son inválidos' });
        }

        try
        {
            const historial = await this.repositorioSimulaciones.obtenerHistorial(dto);

            return res.status(200).json
            ({
                mensaje: 'Simulaciones obtenidas correctamente',
                total: historial.total,
                pagina: historial.pagina,
                limite: historial.limite,
                simulaciones: historial.simulaciones
            });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudieron obtener las simulaciones');
        }
    }

    eliminarSimulacion = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoIdSimulacion.crear(req.params['id']);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'El identificador de la simulación es inválido' });
        }

        try
        {
            await this.repositorioSimulaciones.eliminarPorId(dto.id);

            return res.status(200).json({ mensaje: 'Simulación eliminada correctamente', id: dto.id });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo eliminar la simulación solar');
        }
    }

    recalcularSimulacion = async (req: express.Request, res: express.Response) =>
    {
        const [errorId, dtoId] = DtoIdSimulacion.crear(req.params['id']);

        if (errorId || !dtoId)
        {
            return res.status(400).json({ mensaje: errorId ?? 'El identificador de la simulación es inválido' });
        }

        const [error, dto] = DtoRecalcularSimulacion.crear(req.body);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los datos para recalcular son inválidos' });
        }

        try
        {
            const simulacion = await this.repositorioSimulaciones.recalcular(dtoId.id, dto);

            return res.status(200).json({ mensaje: 'Simulación recalculada correctamente', simulacion });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo recalcular la simulación solar');
        }
    }

    /**
     * Traduce una excepción a la respuesta HTTP.
     *
     * El detalle real solo se registra en el servidor; al cliente se le
     * entrega un mensaje en español y nunca un stack trace.
     */
    private responderError(error: unknown, res: express.Response, mensajeGenerico: string): express.Response
    {
        if (error instanceof ErrorPersonalizado)
        {
            if (error.codigoEstado >= 500)
            {
                console.error('Error interno en el módulo de simulaciones:', error);
            }

            return res.status(error.codigoEstado).json({ mensaje: error.message });
        }

        console.error('Error inesperado en el módulo de simulaciones:', error);

        return res.status(500).json({ mensaje: mensajeGenerico });
    }
}

export = ControladorSimulaciones;
