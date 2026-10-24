import express = require('express');
import AuthRoutes = require('./auth/routes');
import RutasIncentivos = require('./incentivos/rutas');
import RutasClima = require('./clima/rutas');
import RutasAnalytics = require('./analytics/rutas');


class AppRoutes 
{
    static get routes(): express.Router 
   {
     const router = express.Router();

        router.use('/api/Auth', AuthRoutes.routes);
        router.use('/api/v1/incentives', RutasIncentivos.routes);
        router.use('/api/v1/weather', RutasClima.routes);
        router.use('/api/v1/analytics', RutasAnalytics.routes);


    return router;
   }
}

export = AppRoutes;
