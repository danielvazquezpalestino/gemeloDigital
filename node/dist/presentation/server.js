"use strict";
const express = require("express");
class Server {
    app = express();
    port;
    routes;
    constructor(option) {
        const { port = 3100, routes } = option;
        this.port = port;
        this.routes = routes;
    }
    async start() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(this.routes);
        this.app.listen(this.port, () => {
            console.log(`Server started on port ${this.port}`);
        });
    }
}
module.exports = Server;
//# sourceMappingURL=server.js.map