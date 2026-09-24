"use strict";
const path = require("path");
const dotenv = require("dotenv");
const envVar = require("env-var");
dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });
const envs = {
    PORT: envVar.get('PORT').required().asPortNumber()
};
module.exports = envs;
//# sourceMappingURL=envs.js.map