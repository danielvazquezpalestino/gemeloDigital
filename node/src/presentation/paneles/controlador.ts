import express = require('express');
import DtoFiltrarPaneles = require('../../domain/entities/dtos/paneles/filtrar-paneles.dto');
import RepositorioPaneles = require('../../domain/repositories/repositorio-paneles');
import RespondedorErrores = require('../comun/respondedor-errores');

class ControladorPaneles
{
    constructor(private readonly repositorioPaneles: RepositorioPaneles)
    {
    }

    listarPaneles = async (solicitud: express.Request, respuesta: express.Response) =>
    {
        const [error, dto] = DtoFiltrarPaneles.crear(solicitud.query);

        if (error || !dto)
        {
            return respuesta.status(400).json({ mensaje: error ?? 'Los parámetros de consulta son inválidos' });
        }

        try
        {
            const paneles = await this.repositorioPaneles.listar(dto);

            return respuesta.status(200).json({
                mensaje: 'Paneles obtenidos correctamente',
                esDemostracion: true,
                advertencia: 'El catálogo contiene fabricantes y modelos FICTICIOS de demostración.',
                paneles,
            });
        }
        catch (error)
        {
            return RespondedorErrores.responder(error, respuesta, 'No se pudieron obtener los paneles');
        }
    };
}

export = ControladorPaneles;
