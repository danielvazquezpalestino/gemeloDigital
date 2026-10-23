import express = require('express');
import CalculadoraSimulacionSolar = require('../../domain/servicios/calculadora-simulacion-solar');
import ControladorSolar = require('./controlador');
import EstimadorRadiacionSolar = require('../../domain/servicios/estimador-radiacion-solar');
import FuenteDatosSolarImpl = require('../../infrastructure/datasources/fuente-datos-solar.impl');
import RepositorioSolarImpl = require('../../infrastructure/repositories/repositorio-solar.impl');

class RutasSolar
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosSolarImpl(new EstimadorRadiacionSolar());
        const repositorioSolar = new RepositorioSolarImpl(fuenteDatos, new CalculadoraSimulacionSolar());
        const controladorSolar = new ControladorSolar(repositorioSolar);

        router.get('/radiation', controladorSolar.obtenerRadiacion);
        router.get('/production', controladorSolar.calcularProduccion);

        return router;
    }
}

export = RutasSolar;
