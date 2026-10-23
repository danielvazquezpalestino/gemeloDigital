import express = require('express');
import CalculadoraFinanciera = require('../../domain/servicios/calculadora-financiera');
import ControladorFinanciero = require('./controlador');
import RepositorioFinancieroImpl = require('../../infrastructure/repositories/repositorio-financiero.impl');

class RutasFinanciero
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const calculadoraFinanciera = new CalculadoraFinanciera();
        const repositorioFinanciero = new RepositorioFinancieroImpl(calculadoraFinanciera);
        const controladorFinanciero = new ControladorFinanciero(repositorioFinanciero);

        router.post('/estimacion', controladorFinanciero.estimar);

        return router;
    }
}

export = RutasFinanciero;
