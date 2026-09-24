import User = require('../entities/user.entities');
import registerUserDTO = require('../entities/dtos/auth/register-user.dtos');

abstract class AuthDatasource 
{


    
    abstract register(registerUserDto: registerUserDTO): Promise<User>;
}

export = AuthDatasource;