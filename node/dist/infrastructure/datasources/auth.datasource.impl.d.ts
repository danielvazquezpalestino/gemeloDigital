import User = require('../../domain/entities/user.entities');
import registerUserDTO = require('../../domain/entities/dtos/auth/register-user.dtos');
import AuthDatasource = require('../../domain/datasources/auth.datasource');
declare class AuthDatasourceImpl implements AuthDatasource {
    register(registerUserDto: registerUserDTO): Promise<User>;
}
export = AuthDatasourceImpl;
//# sourceMappingURL=auth.datasource.impl.d.ts.map