class FlujoCajaAnual
{
    constructor
    (
        public readonly anio: number,
        public readonly ahorro: number,
        public readonly mantenimiento: number,
        public readonly flujoNeto: number,
        public readonly flujoDescontado: number,
        public readonly flujoAcumulado: number,
    )
    {
    }
}

export = FlujoCajaAnual;
