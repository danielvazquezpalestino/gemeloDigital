import registerUserDTO = require('./entities/dtos/auth/register-user.dtos');
import User = require('./entities/user.entities');
import CustomError = require('./datasources/errors/custom.error');
import AuthDatasource = require('./datasources/auth.datasource');
import AuthRepository = require('./repositories/auth.repository');
declare const domain: {
    registerUserDTO: typeof registerUserDTO;
    User: typeof User;
    CustomError: typeof CustomError;
    AuthDatasource: typeof AuthDatasource;
    AuthRepository: typeof AuthRepository;
};
export = domain;
//# sourceMappingURL=index.d.ts.map