/**
 * Requisito que debe cumplir un solicitante para un incentivo.
 */
export class requisitoIncentivo
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
