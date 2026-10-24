import express = require('express');
import ControladorIncentivos = require('./controlador');
import RepositorioIncentivosImpl = require('../../infrastructure/repositories/repositorio-incentivos.impl');
import FuenteDatosIncentivosImpl = require('../../infrastructure/datasources/fuente-datos-incentivos.impl');
import RepositorioUbicacionesImpl = require('../../infrastructure/repositories/repositorio-ubicaciones.impl');
import FuenteDatosUbicacionesImpl = require('../../infrastructure/datasources/fuente-datos-ubicaciones.impl');
import EvaluadorElegibilidadIncentivos = require('../../domain/servicios/evaluador-elegibilidad-incentivos');

/**
 * Rutas del módulo de incentivos y programas de apoyo.
 *
 * Ensambla las dependencias (fuente de datos → evaluador → repositorio →
 * controlador) y declara las rutas del módulo.
 */
class RutasIncentivos
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosIncentivosImpl();
        const evaluador = new EvaluadorElegibilidadIncentivos();
        const repositorioUbicaciones = new RepositorioUbicacionesImpl(new FuenteDatosUbicacionesImpl());
        const repositorioIncentivos = new RepositorioIncentivosImpl(fuenteDatos, evaluador, repositorioUbicaciones);
        const controladorIncentivos = new ControladorIncentivos(repositorioIncentivos);

        router.get('/', controladorIncentivos.obtenerIncentivos);
        router.get('/eligibility', controladorIncentivos.evaluarElegibilidad);

        return router;
    }
}

export = RutasIncentivos;
