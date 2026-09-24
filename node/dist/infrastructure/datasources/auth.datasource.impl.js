"use strict";
const crypto = require("crypto");
const User = require("../../domain/entities/user.entities");
const registerUserDTO = require("../../domain/entities/dtos/auth/register-user.dtos");
const AuthDatasource = require("../../domain/datasources/auth.datasource");
const CustomError = require("../../domain/datasources/errors/custom.error");
class AuthDatasourceImpl {
    async register(registerUserDto) {
        const { id, name, email, password } = registerUserDto;
        try {
            const user = new User(id, name, email, password, ['USER']);
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                throw CustomError.internalServer(error.message);
            }
            throw CustomError.internalServer('Failed to register user');
        }
    }
}
module.exports = AuthDatasourceImpl;
//# sourceMappingURL=auth.datasource.impl.js.map