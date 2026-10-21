import express = require('express');
import AuthRoutes = require('./auth/routes');
import RutasSimulaciones = require('./simulaciones/rutas');


class AppRoutes 
{
    static get routes(): express.Router 
   {
     const router = express.Router();

        router.use('/api/Auth', AuthRoutes.routes);
        router.use('/api/simulaciones', RutasSimulaciones.routes);


    return router;
   }
}

export = AppRoutes;