import path = require('path');
import dotenv = require('dotenv');
import envVar = require('env-var');

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

const envs =
{
    PORT: envVar.get('PORT').required().asPortNumber(),
    DB_HOST: envVar.get('DB_HOST').required().asString(),
    DB_PORT: envVar.get('DB_PORT').required().asPortNumber(),
    DB_USER: envVar.get('DB_USER').required().asString(),
    DB_PASSWORD: envVar.get('DB_PASSWORD').asString(),
    DB_NAME: envVar.get('DB_NAME').required().asString(),
    JWT_SECRET: envVar.get('JWT_SECRET').required().asString(),
    JWT_EXPIRACION_SEGUNDOS: envVar.get('JWT_EXPIRACION_SEGUNDOS').default(7200).asIntPositive()
};

export = envs;