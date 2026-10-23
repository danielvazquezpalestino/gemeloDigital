import express = require('express');
import DtoElegibilidadIncentivo = require('../../domain/entities/dtos/incentivos/evaluar-elegibilidad.dto');
import EvaluadorElegibilidadIncentivos = require('../../domain/servicios/evaluador-elegibilidad-incentivos');
import RepositorioIncentivos = require('../../domain/repositories/repositorio-incentivos');
import RespondedorErrores = require('../comun/respondedor-errores');

class ControladorIncentivos
{
    constructor(
        private readonly repositorioIncentivos: RepositorioIncentivos,
        private readonly evaluadorElegibilidad: EvaluadorElegibilidadIncentivos,
    )
    {
    }

    listarIncentivos = async (_solicitud: express.Request, respuesta: express.Response) =>
    {
        try
        {
            const incentivos = await this.repositorioIncentivos.listar();

            return respuesta.status(200).json({
                mensaje: 'Incentivos obtenidos correctamente',
                esDemostracion: true,
                advertencia: 'El catálogo contiene programas, montos y requisitos FICTICIOS de demostración.',
                incentivos,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudieron obtener los incentivos');
        }
    };

    evaluarElegibilidad = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoElegibilidadIncentivo.crear(solicitud.query);

        if (error || !dto)
        {
            return respuesta.status(400).json({ mensaje: error ?? 'Los parámetros de elegibilidad son inválidos' });
        }

        try
        {
            const incentivo = await this.repositorioIncentivos.obtenerPorId(dto.incentivoId);
            const resultado = this.evaluadorElegibilidad.evaluar(incentivo, dto);

            return respuesta.status(200).json({
                mensaje: resultado.elegible === null
                    ? 'La elegibilidad no puede determinarse con los datos enviados'
                    : 'Elegibilidad evaluada correctamente',
                resultado,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudo evaluar la elegibilidad');
        }
    };
}

export = ControladorIncentivos;
