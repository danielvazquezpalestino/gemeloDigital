import User = require('../entities/user.entities');
import registerUserDTO = require('../entities/dtos/auth/register-user.dtos');

abstract class AuthRepository
{
    abstract register(registerUserDto: registerUserDTO): Promise<User>;
}

export = AuthRepository;