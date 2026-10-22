

import registerUserDTO = require('./entities/dtos/auth/register-user.dtos');
import User = require('./entities/user.entities');
import Municipio = require('./entities/municipio.entidad');
import CustomError = require('./datasources/errors/custom.error');
import AuthDatasource = require('./datasources/auth.datasource');
import AuthRepository = require('./repositories/auth.repository');
     


const domain = {
    registerUserDTO,
    User,
    Municipio,
    CustomError,
    AuthDatasource,
    AuthRepository
};

export = domain;
