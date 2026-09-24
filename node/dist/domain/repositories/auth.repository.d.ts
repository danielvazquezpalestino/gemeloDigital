import User = require('../entities/user.entities');
import registerUserDTO = require('../entities/dtos/auth/register-user.dtos');
declare abstract class AuthRepository {
    abstract register(registerUserDto: registerUserDTO): Promise<User>;
}
export = AuthRepository;
//# sourceMappingURL=auth.repository.d.ts.map