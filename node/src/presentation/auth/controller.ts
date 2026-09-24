import express = require('express');
import registerUserDTO = require('../../domain/entities/dtos/auth/register-user.dtos');
import AuthRepository = require('../../domain/repositories');

class AuthController
{
    constructor(
        private readonly authRepository: AuthRepository,
    ) {}

    registerUser = async (req: express.Request, res: express.Response) =>
    {
        const [error, registerUserDto] = registerUserDTO.create(req.body);

        if (error) {
            return res.status(400).json({ error });
        }

        try {
            const user = await this.authRepository.register(registerUserDto!);
            return res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }

            return res.status(500).json({ error: 'Failed to register user' });
        }
    }

    loginUser = async (req: express.Request, res: express.Response) =>
    {
        return res.json({ message: 'Login successful' });
    }
}

export = AuthController;