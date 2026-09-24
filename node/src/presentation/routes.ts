import express = require('express');
import AuthRoutes = require('./auth/routes');


class AppRoutes 
{
    static get routes(): express.Router 
   {
     const router = express.Router();

        router.use('/api/Auth', AuthRoutes.routes);


    return router;
   }
}

export = AppRoutes;