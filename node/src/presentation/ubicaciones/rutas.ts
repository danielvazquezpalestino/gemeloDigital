import express = require('express');
import ControladorUbicaciones = require('./controlador');
import RepositorioUbicacionesImpl = require('../../infrastructure/repositorios/repositorio-ubicaciones.impl');
import FuenteDatosUbicacionesImpl = require('../../infrastructure/fuentes-datos/fuente-datos-ubicaciones.impl');

class RutasUbicaciones {
    static get routes(): express.Router {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosUbicacionesImpl();
        const repositorioUbicaciones = new RepositorioUbicacionesImpl(fuenteDatos);
        const controladorUbicaciones = new ControladorUbicaciones(repositorioUbicaciones);

        router.get('/municipios', controladorUbicaciones.obtenerMunicipios);

        return router;
    }
}

export = RutasUbicaciones;
