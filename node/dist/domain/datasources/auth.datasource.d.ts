import User = require('../entities/user.entities');
import registerUserDTO = require('../entities/dtos/auth/register-user.dtos');
declare abstract class AuthDatasource {
    abstract register(registerUserDto: registerUserDTO): Promise<User>;
}
export = AuthDatasource;
//# sourceMappingURL=auth.datasource.d.ts.map