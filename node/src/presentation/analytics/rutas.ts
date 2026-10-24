import express = require('express');
import ControladorAnalytics = require('./controlador');
import RepositorioAnalyticsImpl = require('../../infrastructure/repositories/repositorio-analytics.impl');
import FuenteDatosSimulacionesImpl = require('../../infrastructure/datasources/fuente-datos-simulaciones.impl');

/**
 * Rutas del módulo de analítica y estadísticas por municipio.
 */
class RutasAnalytics
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatosSimulaciones = new FuenteDatosSimulacionesImpl();
        const repositorioAnalytics = new RepositorioAnalyticsImpl(fuenteDatosSimulaciones);
        const controladorAnalytics = new ControladorAnalytics(repositorioAnalytics);

        router.get('/municipalities', controladorAnalytics.obtenerEstadisticas);

        return router;
    }
}

export = RutasAnalytics;
