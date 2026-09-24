"use strict";
const express = require("express");
const registerUserDTO = require("../../domain/entities/dtos/auth/register-user.dtos");
const AuthRepository = require("../../domain/repositories");
class AuthController {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    registerUser = async (req, res) => {
        const [error, registerUserDto] = registerUserDTO.create(req.body);
        if (error) {
            return res.status(400).json({ error });
        }
        try {
            const user = await this.authRepository.register(registerUserDto);
            return res.json(user);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Failed to register user' });
        }
    };
    loginUser = async (req, res) => {
        return res.json({ message: 'Login successful' });
    };
}
module.exports = AuthController;
//# sourceMappingURL=controller.js.map