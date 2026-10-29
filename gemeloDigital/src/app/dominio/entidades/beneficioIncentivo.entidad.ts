/**
 * Beneficio económico o en especie de un incentivo.
 */
export class beneficioIncentivo
{
    constructor
    (
        public readonly tipo: string,
        public readonly monto: number | null,
        public readonly porcentaje: number | null,
        public readonly moneda: string,
    )
    {
    }
}
