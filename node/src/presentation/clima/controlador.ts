import express = require('express');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import FuenteDatosClima = require('../../domain/datasources/fuente-datos-clima');
import DtoConsultarPronostico = require('../../domain/entities/dtos/clima/consultar-pronostico.dto');

/**
 * Manejo HTTP del módulo del clima / pronóstico meteorológico.
 *
 * Delega en la fuente de datos (proveedor meteorológico) y traduce el
 * resultado o el error a la respuesta JSON con el formato `{ "mensaje": "..." }`.
 */
class ControladorClima
{
    constructor(private readonly fuenteDatosClima: FuenteDatosClima)
    {
    }

    obtenerPronostico = async (req: express.Request, res: express.Response) =>
    {
        const [error, dto] = DtoConsultarPronostico.crear(req.query);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los parámetros de consulta son inválidos' });
        }

        try
        {
            const pronostico = await this.fuenteDatosClima.obtenerPronostico(dto.latitude, dto.longitude, dto.dias);

            return res.status(200).json
            ({
                mensaje: 'El pronóstico meteorológico se obtuvo correctamente',
                pronostico,
            });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo obtener el pronóstico meteorológico');
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
                console.error('Error interno en el módulo del clima:', error);
            }

            return res.status(error.codigoEstado).json({ mensaje: error.message });
        }

        console.error('Error inesperado en el módulo del clima:', error);

        return res.status(500).json({ mensaje: mensajeGenerico });
    }
}

export = ControladorClima;
