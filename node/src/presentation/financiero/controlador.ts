import express = require('express');
import CalculadoraFinanciera = require('../../domain/servicios/calculadora-financiera');
import DtoEstimarFinanciero = require('../../domain/entities/dtos/financiero/estimar-financiero.dto');
import RespondedorErrores = require('../comun/respondedor-errores');

class ControladorFinanciero
{
    constructor(private readonly calculadoraFinanciera: CalculadoraFinanciera)
    {
    }

    estimar = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoEstimarFinanciero.crear(solicitud.body);

        if (error || !dto)
        {
            return respuesta.status(400).json({ mensaje: error ?? 'Los datos de la estimación financiera son inválidos' });
        }

        try
        {
            const resultado = this.calculadoraFinanciera.calcular(dto);

            return respuesta.status(200).json({
                mensaje: 'Estimación financiera calculada correctamente',
                resultado,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudo calcular la estimación financiera');
        }
    };
}

export = ControladorFinanciero;
