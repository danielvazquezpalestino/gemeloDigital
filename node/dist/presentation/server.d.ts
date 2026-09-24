import express = require("express");
interface Options {
    port?: number;
    routes: express.Router;
}
declare class Server {
    readonly app: import("express-serve-static-core").Express;
    private readonly port;
    private readonly routes;
    constructor(option: Options);
    start(): Promise<void>;
}
export = Server;
//# sourceMappingURL=server.d.ts.map