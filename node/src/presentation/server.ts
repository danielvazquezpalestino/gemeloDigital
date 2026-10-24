import express = require("express");
import swaggerUi = require('swagger-ui-express');
import Swagger = require('./swagger');

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
    private readonly swagger: Swagger;

    constructor (option: Options)
    {
        const { port = 3100 , routes } = option;
        this.port = port;
        this.routes = routes;
        this.swagger = new Swagger();
    } 
async start ()
{

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));



    this.app.use(this.routes);

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swagger.documento));

    this.app.listen(this.port , () =>
    {
        console.log(`Server started on port ${this.port}`);
    });
}
}

export = Server;
