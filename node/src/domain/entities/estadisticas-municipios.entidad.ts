class EstadisticasMunicipios
{
    constructor
    (
        public readonly municipioId: number | null,
        public readonly simulaciones: number,
        public readonly instalacionesRegistradas: number | null,
        public readonly consumoElectrico: { mensual: number; anual: number },
        public readonly produccionSolar: { mensual: number; anual: number },
        public readonly capacidadFotovoltaica: { recomendada: number; instalada: number | null },
        public readonly ahorroEconomico: number,
        public readonly emisionesCarbono: { kg: number; toneladas: number },
        public readonly simulacionesPorTipoBeneficiario: readonly { beneficiario: string; total: number }[],
        public readonly fechaActualizacion: Date,
    )
    {
    }
}

export = EstadisticasMunicipios;
