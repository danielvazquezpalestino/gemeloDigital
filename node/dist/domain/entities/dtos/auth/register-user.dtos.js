"use strict";
const config = require("../../../../config/envs.ts");
class registerUserDTO {
    id;
    name;
    email;
    password;
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
    static create(object) {
        const payload = object ?? {};
        const { id, name, email, password } = payload;
        if (!payload || typeof payload !== 'object') {
            return ["Invalid user data", undefined];
        }
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
        if (!name)
            return ["Invalid user name", undefined];
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
module.exports = registerUserDTO;
//# sourceMappingURL=register-user.dtos.js.map