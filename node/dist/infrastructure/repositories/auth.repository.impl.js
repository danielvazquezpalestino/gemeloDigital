"use strict";
const User = require("../../domain/entities/user.entities");
const registerUserDTO = require("../../domain/entities/dtos/auth/register-user.dtos");
const AuthDatasource = require("../../domain/datasources/auth.datasource");
const AuthRepository = require("../../domain/repositories/auth.repository");
class AuthRepositoryImpl {
    authDatasource;
    constructor(authDatasource) {
        this.authDatasource = authDatasource;
    }
    register(registerUserDto) {
        return this.authDatasource.register(registerUserDto);
    }
}
module.exports = AuthRepositoryImpl;
//# sourceMappingURL=auth.repository.impl.js.map