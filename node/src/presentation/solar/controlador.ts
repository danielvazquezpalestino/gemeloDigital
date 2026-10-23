import express = require('express');
import CustomError = require('../../domain/datasources/errors/custom.error');
import DtoCalcularProduccion = require('../../domain/entities/dtos/solar/calcular-produccion.dto');
import DtoConsultarRadiacion = require('../../domain/entities/dtos/solar/consultar-radiacion.dto');
import RepositorioSolar = require('../../domain/repositories/repositorio-solar');
import RespondedorErrores = require('../comun/respondedor-errores');

/**
 * Manejo HTTP del módulo de servicios solares.
 *
 * Los errores de validación se lanzan como `CustomError` para que el
 * respondedor común aplique el formato único `{ "mensaje": "..." }`.
 */
class ControladorSolar
{
    constructor(private readonly repositorioSolar: RepositorioSolar)
    {
    }

    obtenerRadiacion = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoConsultarRadiacion.crear(solicitud.query);

        if (error || !dto)
        {
            return RespondedorErrores.responder(
                CustomError.badRequest(error ?? 'Los parámetros de ubicación son inválidos'),
                respuesta,
                'No se pudo consultar la radiación solar',
            );
        }

        try
        {
            const radiacion = await this.repositorioSolar.obtenerRadiacion(dto);

            return respuesta.status(200).json({
                mensaje: 'Radiación solar estimada correctamente',
                radiacion,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudo consultar la radiación solar');
        }
    };

    calcularProduccion = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoCalcularProduccion.crear(solicitud.query);

        if (error || !dto)
        {
            return RespondedorErrores.responder(
                CustomError.badRequest(error ?? 'Los parámetros de producción son inválidos'),
                respuesta,
                'No se pudo calcular la producción solar',
            );
        }

        try
        {
            const produccion = await this.repositorioSolar.calcularProduccion(dto);

            return respuesta.status(200).json({
                mensaje: 'Producción solar estimada correctamente',
                produccion,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudo calcular la producción solar');
        }
    };
}

export = ControladorSolar;
