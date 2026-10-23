import express = require('express');
import AuthRoutes = require('./auth/routes');
import RutasFinanciero = require('./financiero/rutas');


class AppRoutes 
{
    static get routes(): express.Router 
   {
     const router = express.Router();

        router.use('/api/Auth', AuthRoutes.routes);
        router.use('/api/financiero', RutasFinanciero.routes);


    return router;
   }
}

export = AppRoutes;