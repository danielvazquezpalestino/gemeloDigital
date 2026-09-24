import User = require('../../domain/entities/user.entities');
import registerUserDTO = require('../../domain/entities/dtos/auth/register-user.dtos');
import AuthDatasource = require('../../domain/datasources/auth.datasource');
import AuthRepository = require('../../domain/repositories/auth.repository');
declare class AuthRepositoryImpl implements AuthRepository {
    private readonly authDatasource;
    constructor(authDatasource: AuthDatasource);
    register(registerUserDto: registerUserDTO): Promise<User>;
}
export = AuthRepositoryImpl;
//# sourceMappingURL=auth.repository.impl.d.ts.map