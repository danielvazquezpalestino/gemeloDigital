import express = require('express');
import CalculadoraFacturaElectrica = require('../../domain/servicios/calculadora-factura-electrica');
import ControladorElectricidad = require('./controlador');
import EvaluadorRiesgoDac = require('../../domain/servicios/evaluador-riesgo-dac');
import FuenteDatosElectricidadImpl = require('../../infrastructure/datasources/fuente-datos-electricidad.impl');
import RepositorioElectricidadImpl = require('../../infrastructure/repositories/repositorio-electricidad.impl');

class RutasElectricidad
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosElectricidadImpl();
        const repositorioElectricidad = new RepositorioElectricidadImpl(
            fuenteDatos,
            new CalculadoraFacturaElectrica(),
            new EvaluadorRiesgoDac(),
        );
        const controladorElectricidad = new ControladorElectricidad(repositorioElectricidad);

        router.get('/tariffs', controladorElectricidad.listarTarifas);
        router.post('/estimate-bill', controladorElectricidad.estimarFactura);
        router.get('/dac-risk', controladorElectricidad.evaluarRiesgoDac);

        return router;
    }
}

export = RutasElectricidad;
