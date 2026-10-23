import express = require('express');
import ControladorIncentivos = require('./controlador');
import EvaluadorElegibilidadIncentivos = require('../../domain/servicios/evaluador-elegibilidad-incentivos');
import FuenteDatosIncentivosImpl = require('../../infrastructure/datasources/fuente-datos-incentivos.impl');
import RepositorioIncentivosImpl = require('../../infrastructure/repositories/repositorio-incentivos.impl');

class RutasIncentivos
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosIncentivosImpl();
        const repositorioIncentivos = new RepositorioIncentivosImpl(fuenteDatos);
        const controladorIncentivos = new ControladorIncentivos(
            repositorioIncentivos,
            new EvaluadorElegibilidadIncentivos(),
        );

        router.get('/', controladorIncentivos.listarIncentivos);
        router.get('/eligibility', controladorIncentivos.evaluarElegibilidad);

        return router;
    }
}

export = RutasIncentivos;
