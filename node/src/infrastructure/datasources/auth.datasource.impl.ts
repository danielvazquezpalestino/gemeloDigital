
import crypto = require('crypto');
import User = require('../../domain/entities/user.entities');
import registerUserDTO = require('../../domain/entities/dtos/auth/register-user.dtos');
import AuthDatasource = require('../../domain/datasources/auth.datasource');
import CustomError = require('../../domain/datasources/errors/custom.error');

class AuthDatasourceImpl implements AuthDatasource
{
    async register(registerUserDto: registerUserDTO): Promise<User>
    {
        const { id, name, email, password } = registerUserDto;

        try {
            return  new User(
               id,
                name,
                email,
                password,
                ['ADMIN_ROLE'],
            );

            
        }
        catch (error) {
            if (error instanceof Error) {
                throw CustomError.internalServer(error.message);
            }

            throw CustomError.internalServer('Failed to register user');
        }
    }
}

export = AuthDatasourceImpl;