import Server = require('./presentation/server');
import envs = require('./config/envs.ts');
import AppRoutes = require('./presentation/routes');

(() =>
{
    main();
})();

async function main(): Promise<void>
{
    await new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}
