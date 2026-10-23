class RequisitoIncentivo
{
    constructor(
        public readonly campo: string,
        public readonly operador: string,
        public readonly valor: string | number,
        public readonly descripcion: string,
    )
    {
    }
}

export = RequisitoIncentivo;
