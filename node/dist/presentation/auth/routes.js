"use strict";
const express = require("express");
const AuthController = require("./controller");
const AuthRepositoryImpl = require("../../infrastructure/repositories/auth.repository.impl");
const AuthDatasourceImpl = require("../../infrastructure/datasources/auth.datasource.impl");
class AuthRoutes {
    static get routes() {
        const router = express.Router();
        const dataSource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl(dataSource);
        const authController = new AuthController(authRepository);
        router.post('/login', authController.loginUser);
        router.post('/register', authController.registerUser);
        return router;
    }
}
module.exports = AuthRoutes;
//# sourceMappingURL=routes.js.map