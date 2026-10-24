import Server = require('./presentation/server');
import envs = require('./config/envs.ts/');
import AppRoutes = require('./presentation/routes');
import Swagger = require('./presentation/swagger');
import Database = require('./infrastructure/database');

(() =>
{
    main();
})();

async function main(): Promise<void>
{
    try {
        await Database.connect();
    } catch (error) {
        process.exit(1);
    }

    await new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}
