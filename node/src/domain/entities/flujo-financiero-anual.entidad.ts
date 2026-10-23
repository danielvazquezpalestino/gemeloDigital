class FlujoFinancieroAnual
{
    constructor(
        public readonly anio: number,
        public readonly flujoNeto: number,
        public readonly flujoDescontado: number,
        public readonly acumulado: number,
    )
    {
    }
}

export = FlujoFinancieroAnual;
