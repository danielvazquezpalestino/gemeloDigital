"use strict";
const registerUserDTO = require("./entities/dtos/auth/register-user.dtos");
const User = require("./entities/user.entities");
const CustomError = require("./datasources/errors/custom.error");
const AuthDatasource = require("./datasources/auth.datasource");
const AuthRepository = require("./repositories/auth.repository");
const domain = {
    registerUserDTO,
    User,
    CustomError,
    AuthDatasource,
    AuthRepository
};
module.exports = domain;
//# sourceMappingURL=index.js.map