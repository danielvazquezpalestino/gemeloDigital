import express = require('express');
import ControladorPaneles = require('./controlador');
import FuenteDatosPanelesImpl = require('../../infrastructure/datasources/fuente-datos-paneles.impl');
import RepositorioPanelesImpl = require('../../infrastructure/repositories/repositorio-paneles.impl');

class RutasPaneles
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosPanelesImpl();
        const repositorioPaneles = new RepositorioPanelesImpl(fuenteDatos);
        const controladorPaneles = new ControladorPaneles(repositorioPaneles);

        router.get('/', controladorPaneles.listarPaneles);

        return router;
    }
}

export = RutasPaneles;
