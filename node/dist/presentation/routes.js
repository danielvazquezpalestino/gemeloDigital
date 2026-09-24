"use strict";
const express = require("express");
const AuthRoutes = require("./auth/routes");
class AppRoutes {
    static get routes() {
        const router = express.Router();
        router.use('/api/Auth', AuthRoutes.routes);
        return router;
    }
}
module.exports = AppRoutes;
//# sourceMappingURL=routes.js.map