import express = require('express');
import DtoEstimacionFinanciera = require('../../domain/entities/dtos/financiero/estimacion-financiera.dto');
import ErrorPersonalizado = require('../../domain/datasources/errors/custom-error');
import RepositorioFinanciero = require('../../domain/repositories/repositorio-financiero');

class ControladorFinanciero
{
    constructor(private readonly repositorioFinanciero: RepositorioFinanciero)
    {
    }

    estimar = (req: express.Request, res: express.Response): express.Response =>
    {
        const [error, dto] = DtoEstimacionFinanciera.crear(req.body);

        if (error || !dto)
        {
            return res.status(400).json({ mensaje: error ?? 'Los datos de la estimación financiera son inválidos' });
        }

        try
        {
            const estimacion = this.repositorioFinanciero.calcularEstimacion(dto);

            return res.status(200).json({ mensaje: 'Estimación financiera calculada correctamente', estimacion });
        }
        catch (error)
        {
            return this.responderError(error, res, 'No se pudo calcular la estimación financiera');
        }
    }

    private responderError(error: unknown, res: express.Response, mensajeGenerico: string): express.Response
    {
        if (error instanceof ErrorPersonalizado)
        {
            if (error.codigoEstado >= 500)
            {
                console.error('Error interno en el módulo financiero:', error);
            }

            return res.status(error.codigoEstado).json({ mensaje: error.message });
        }

        console.error('Error inesperado en el módulo financiero:', error);

        return res.status(500).json({ mensaje: mensajeGenerico });
    }
}

export = ControladorFinanciero;
