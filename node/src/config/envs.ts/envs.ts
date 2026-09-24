import path = require('path');
import dotenv = require('dotenv');
import envVar = require('env-var');

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

const envs =
{
    PORT: envVar.get('PORT').required().asPortNumber()
};

export = envs;
 