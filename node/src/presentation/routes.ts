import express = require('express');
import AuthRoutes = require('./auth/routes');
import RutasV1 = require('./rutas-v1');


class AppRoutes 
{
    static get routes(): express.Router 
   {
     const router = express.Router();

        router.use('/api/Auth', AuthRoutes.routes);
        router.use('/api/v1', RutasV1.routes);

    return router;
   }
}

export = AppRoutes;