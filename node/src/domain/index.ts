

import registerUserDTO = require('./entities/dtos/auth/register-user.dtos');
import User = require('./entities/user.entities');
import Municipio = require('./entidades/municipio.entidad');
import CustomError = require('./datasources/errors/custom.error');
import AuthDatasource = require('./datasources/auth.datasource');
import AuthRepository = require('./repositories/auth.repository');
import RepositorioUbicaciones = require('./repositorios/repositorio-ubicaciones');
import FuenteDatosUbicaciones = require('./fuentes-datos/fuente-datos-ubicaciones');
     


const domain = {
    registerUserDTO,
    User,
    Municipio,
    CustomError,
    AuthDatasource,
    AuthRepository,
    RepositorioUbicaciones,
    FuenteDatosUbicaciones
};

export = domain;