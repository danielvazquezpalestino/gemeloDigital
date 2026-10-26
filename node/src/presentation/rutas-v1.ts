import express = require('express');
import RutasElectricidad = require('./electricidad/rutas');
import RutasFinanciero = require('./financiero/rutas');
import RutasIncentivos = require('./incentivos/rutas');
import RutasPaneles = require('./paneles/rutas');
import RutasSimulaciones = require('./simulaciones/rutas');
import RutasSolar = require('./solar/rutas');

/**
 * Enrutador versionado de los módulos nuevos.
 *
 * Se monta en `/api/v1` sin alterar las rutas existentes de autenticación.
 */
class RutasV1
{
    static get routes(): express.Router
    {
        const router = express.Router();

        router.use('/electricity', RutasElectricidad.routes);
        router.use('/panels', RutasPaneles.routes);
        router.use('/financial', RutasFinanciero.routes);
        router.use('/incentives', RutasIncentivos.routes);
        router.use('/simulaciones', RutasSimulaciones.routes);
        router.use('/solar', RutasSolar.routes);

        return router;
    }
}

export = RutasV1;
