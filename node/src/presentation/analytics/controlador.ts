import express = require('express');
import DtoConsultarEstadisticas = require('../../domain/entities/dtos/analytics/consultar-estadisticas.dto');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import EstadisticasMunicipios = require('../../domain/entities/estadisticas-municipios.entidad');
import RepositorioAnalytics = require('../../domain/repositories/repositorio-analytics');

/**
 * Manejo HTTP del módulo de analítica y estadísticas por municipio.
 *
 * Devuelve indicadores agregados del uso y potencial de la energía solar a
 * partir de los datos persistidos. Las estadísticas se entregan agregadas y no
 * exponen información personal de los usuarios.
 */
class ControladorAnalytics
{
    constructor(private readonly repositorioAnalytics: RepositorioAnalytics)
    {
    }

    obtenerEstadisticas = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoConsultarEstadisticas.crear(req.query);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los parámetros de consulta son inválidos' });
        }

        try
        {
            const estadisticas: EstadisticasMunicipios = await this.repositorioAnalytics.obtenerEstadisticas(dto);

            return res.status(200).json
            ({
                mensaje: 'Estadísticas de municipios obtenidas correctamente',
                estadisticas,
            });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudieron obtener las estadísticas de municipios');
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
                console.error('Error interno en el módulo de analítica:', error);
            }

            return res.status(error.codigoEstado).json({ mensaje: error.message });
        }

        console.error('Error inesperado en el módulo de analítica:', error);

        return res.status(500).json({ mensaje: mensajeGenerico });
    }
}

export = ControladorAnalytics;
