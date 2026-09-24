

import config = require('../../../../config/envs.ts');

class registerUserDTO
{
    private constructor
     (
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,

    ) {}

    static create(object: {[key: string]: any} | undefined): [string | undefined, registerUserDTO | undefined]
    {
        const payload = object ?? {};
        const { id, name, email, password } = payload;

        if (!payload || typeof payload !== 'object') {
            return ["Invalid user data", undefined];
        }

        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

        if (!name) return ["Invalid user name", undefined];
        if (!normalizedEmail || !config.Validators.email.test(normalizedEmail)) {
            return ["Invalid user email", undefined];
        }
        if (!password || password.length < 6) {
            return ["Invalid user password", undefined];
        }

          return [
           undefined, new registerUserDTO(id, name.trim(), normalizedEmail, password)
        ];
    }
}

export = registerUserDTO;