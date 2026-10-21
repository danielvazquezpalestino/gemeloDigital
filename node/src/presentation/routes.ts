import express = require('express');
import AuthRoutes = require('./auth/routes');
import RutasUbicaciones = require('./ubicaciones/rutas');


class AppRoutes 
{
    static get routes(): express.Router 
   {
     const router = express.Router();

        router.use('/api/Auth', AuthRoutes.routes);
        router.use('/api/ubicaciones', RutasUbicaciones.routes);


    return router;
   }
}

export = AppRoutes;