import express = require("express");

interface Options
{
    port?: number;
    routes: express.Router;
}

class Server 
{
    public readonly app = express();
    private readonly port: number;
    private readonly routes: express.Router;

    constructor (option: Options)
    {
        const { port = 3100 , routes } = option;
        this.port = port;
        this.routes = routes;
    } 
async start ()
{

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));



    this.app.use(this.routes);
    this.app.listen(this.port , () =>
    {
        console.log(`Server started on port ${this.port}`);
    });
}
}

export = Server;

