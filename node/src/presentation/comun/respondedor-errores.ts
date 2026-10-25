import express = require('express');
import CustomError = require('../../domain/datasources/errors/custom.error');

/**
 * Traduce excepciones al formato único de error de la API.
 *
 * Los errores 5xx nunca exponen el mensaje interno al cliente; el detalle
 * real se registra en la consola del servidor.
 */
class RespondedorErrores
{
    static responder(error: unknown, respuesta: express.Response, mensajeGenerico: string): express.Response
    {
        if (error instanceof CustomError)
        {
            if (error.statusCode >= 500)
            {
                console.error(mensajeGenerico, error);
                return respuesta.status(error.statusCode).json({ mensaje: mensajeGenerico });
            }

            return respuesta.status(error.statusCode).json({ mensaje: error.message });
        }

        console.error(mensajeGenerico, error);
        return respuesta.status(500).json({ mensaje: mensajeGenerico });
    }
}

export = RespondedorErrores;
