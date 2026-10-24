import express = require('express');
import ControladorClima = require('./controlador');
import FuenteDatosClimaImpl = require('../../infrastructure/datasources/fuente-datos-clima.impl');

/**
 * Rutas del módulo del clima / pronóstico meteorológico.
 */
class RutasClima
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatosClima = new FuenteDatosClimaImpl();
        const controladorClima = new ControladorClima(fuenteDatosClima);

        router.get('/forecast', controladorClima.obtenerPronostico);

        return router;
    }
}

export = RutasClima;
