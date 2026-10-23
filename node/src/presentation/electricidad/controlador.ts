import express = require('express');
import CustomError = require('../../domain/datasources/errors/custom.error');
import DtoEstimarFactura = require('../../domain/entities/dtos/electricidad/estimar-factura.dto');
import DtoRiesgoDac = require('../../domain/entities/dtos/electricidad/riesgo-dac.dto');
import RepositorioElectricidad = require('../../domain/repositories/repositorio-electricidad');
import RespondedorErrores = require('../comun/respondedor-errores');

class ControladorElectricidad
{
    constructor(private readonly repositorioElectricidad: RepositorioElectricidad)
    {
    }

    listarTarifas = async (_solicitud: express.Request, respuesta: express.Response) =>
    {
        try
        {
            const tarifas = await this.repositorioElectricidad.listarTarifas();
            const esDemostracion = tarifas.some((tarifa) => tarifa.esDemostracion);

            return respuesta.status(200).json({
                mensaje: 'Tarifas obtenidas correctamente',
                esDemostracion,
                advertencia: esDemostracion
                    ? 'El catálogo contiene datos de DEMOSTRACIÓN. No son tarifas oficiales de la CFE.'
                    : null,
                tarifas,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudieron obtener las tarifas');
        }
    };

    estimarFactura = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoEstimarFactura.crear(solicitud.body);

        if (error || !dto)
        {
            return RespondedorErrores.responder(
                CustomError.badRequest(error ?? 'Los datos de la estimación son inválidos'),
                respuesta,
                'No se pudo calcular la estimación de la factura',
            );
        }

        try
        {
            const factura = await this.repositorioElectricidad.estimarFactura(dto);

            return respuesta.status(200).json({
                mensaje: 'Estimación de factura calculada correctamente',
                factura,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudo calcular la estimación de la factura');
        }
    };

    evaluarRiesgoDac = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoRiesgoDac.crear(solicitud.query);

        if (error || !dto)
        {
            return RespondedorErrores.responder(
                CustomError.badRequest(error ?? 'Los parámetros de evaluación son inválidos'),
                respuesta,
                'No se pudo evaluar el riesgo DAC',
            );
        }

        try
        {
            const evaluacion = await this.repositorioElectricidad.evaluarRiesgoDac(dto);

            return respuesta.status(200).json({
                mensaje: evaluacion.puedeDeterminarse
                    ? 'Riesgo DAC evaluado con una regla de demostración'
                    : 'El riesgo DAC no puede determinarse con los datos disponibles',
                evaluacion,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudo evaluar el riesgo DAC');
        }
    };
}

export = ControladorElectricidad;
