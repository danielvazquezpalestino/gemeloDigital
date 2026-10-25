import express = require('express');
import CalculadoraFinanciera = require('../../domain/servicios/calculadora-financiera');
import ControladorFinanciero = require('./controlador');

class RutasFinanciero
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const controladorFinanciero = new ControladorFinanciero(new CalculadoraFinanciera());

        router.post('/estimate', controladorFinanciero.estimar);

        return router;
    }
}

export = RutasFinanciero;
