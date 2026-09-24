import express = require('express');
import AuthController = require('./controller');
import AuthRepositoryImpl = require('../../infrastructure/repositories/auth.repository.impl');
import AuthDatasourceImpl = require('../../infrastructure/datasources/auth.datasource.impl');

class AuthRoutes
{
    static get routes(): express.Router
    {
        const router = express.Router();
        const dataSource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl(dataSource);
        const authController = new AuthController(authRepository);

        router.post('/login', authController.loginUser);
        router.post('/register', authController.registerUser);

        return router;
    }
}

export = AuthRoutes;