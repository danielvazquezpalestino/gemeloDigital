import express = require('express');
import ControladorAutenticacion = require('./controlador');
import FuenteDatosAutenticacionImpl = require('../../infrastructure/datasources/fuente-datos-autenticacion.impl');
import RepositorioAutenticacionImpl = require('../../infrastructure/repositories/repositorio-autenticacion.impl');
import entornos = require('../../config/envs.ts/');

/**
 * Rutas del módulo de autenticación.
 *
 * Se conservan las rutas públicas existentes (`/register` y `/login`) para no
 * romper a los consumidores ya documentados en Swagger.
 */
class RutasAutenticacion
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const fuenteDatos = new FuenteDatosAutenticacionImpl();
        const repositorioAutenticacion = new RepositorioAutenticacionImpl(
            fuenteDatos,
            entornos.JWT_SECRET,
            entornos.JWT_EXPIRACION_SEGUNDOS,
        );
        const controladorAutenticacion = new ControladorAutenticacion(repositorioAutenticacion);

        router.post('/register', controladorAutenticacion.registrar);
        router.post('/login', controladorAutenticacion.iniciarSesion);

        return router;
    }
}

export = RutasAutenticacion;
