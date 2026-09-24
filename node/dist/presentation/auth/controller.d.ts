import express = require('express');
import AuthRepository = require('../../domain/repositories');
declare class AuthController {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    registerUser: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>>>;
    loginUser: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>>>;
}
export = AuthController;
//# sourceMappingURL=controller.d.ts.map