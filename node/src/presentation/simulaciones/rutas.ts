import express = require('express');
import CalculadoraSimulacionSolar = require('../../domain/servicios/calculadora-simulacion-solar');
import ControladorSimulaciones = require('./controlador');
import FuenteDatosSimulacionesImpl = require('../../infrastructure/fuentes-datos/fuente-datos-simulaciones.impl');
import RepositorioSimulacionesImpl = require('../../infrastructure/repositorios/repositorio-simulaciones.impl');

/**
 * Rutas del módulo de simulaciones solares.
 *
 * Ensambla las dependencias (fuente de datos → repositorio → controlador) y
 * declara las rutas del módulo.
 */
class RutasSimulaciones
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosSimulacionesImpl();
        const repositorioSimulaciones = new RepositorioSimulacionesImpl(fuenteDatos, new CalculadoraSimulacionSolar());
        const controladorSimulaciones = new ControladorSimulaciones(repositorioSimulaciones);

        router.post('/', controladorSimulaciones.crearSimulacion);
        router.get('/', controladorSimulaciones.obtenerHistorial);
        router.get('/:id', controladorSimulaciones.obtenerSimulacion);
        router.delete('/:id', controladorSimulaciones.eliminarSimulacion);
        router.post('/:id/recalcular', controladorSimulaciones.recalcularSimulacion);

        return router;
    }
}

export = RutasSimulaciones;
