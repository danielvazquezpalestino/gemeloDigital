"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server = require("./presentation/server");
const envs = require("./config/envs.ts");
const AppRoutes = require("./presentation/routes");
(() => {
    main();
})();
async function main() {
    await new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}
//# sourceMappingURL=app.js.map