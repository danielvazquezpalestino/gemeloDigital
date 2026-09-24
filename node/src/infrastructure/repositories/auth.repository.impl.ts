import User = require('../../domain/entities/user.entities');
import registerUserDTO = require('../../domain/entities/dtos/auth/register-user.dtos');
import AuthDatasource = require('../../domain/datasources/auth.datasource');
import AuthRepository = require('../../domain/repositories/auth.repository');

class AuthRepositoryImpl implements AuthRepository
{
    constructor(private readonly authDatasource: AuthDatasource)
    {
    }

    register(registerUserDto: registerUserDTO): Promise<User>
    {
        return this.authDatasource.register(registerUserDto);
    }
}

export = AuthRepositoryImpl;