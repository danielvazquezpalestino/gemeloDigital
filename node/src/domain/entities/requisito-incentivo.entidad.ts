class RequisitoIncentivo
{
    constructor
    (
        public readonly campo: string,
        public readonly descripcion: string,
        public readonly verificado: boolean,
        public readonly requerido: boolean,
        public readonly valor: number | null,
    )
    {
    }
}

export = RequisitoIncentivo;
