/**
 * Estadísticas agregadas de consumo y producción solar por municipio.
 */
export class estadisticasMunicipios
{
    constructor
    (
        public readonly municipioId: number | null,
        public readonly simulaciones: number,
        public readonly instalacionesRegistradas: number | null,
        public readonly consumoElectrico: { readonly mensual: number; readonly anual: number },
        public readonly produccionSolar: { readonly mensual: number; readonly anual: number },
        public readonly capacidadFotovoltaica: {
            readonly recomendada: number;
            readonly instalada: number | null;
        },
        public readonly ahorroEconomico: number,
        public readonly emisionesCarbono: { readonly kg: number; readonly toneladas: number },
        public readonly simulacionesPorTipoBeneficiario: readonly {
            readonly beneficiario: string;
            readonly total: number;
        }[],
        public readonly fechaActualizacion: Date,
    )
    {
    }
}
