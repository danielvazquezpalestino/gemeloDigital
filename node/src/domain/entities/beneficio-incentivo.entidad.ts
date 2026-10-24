class BeneficioIncentivo
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

export = BeneficioIncentivo;
