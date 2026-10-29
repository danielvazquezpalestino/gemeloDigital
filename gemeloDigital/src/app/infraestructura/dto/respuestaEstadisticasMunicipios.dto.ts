/**
 * DTO de las estadísticas agregadas por municipio.
 */
export interface estadisticasMunicipiosDto
{
    readonly municipioId: number | null;
    readonly simulaciones: number;
    readonly instalacionesRegistradas: number | null;
    readonly consumoElectrico: {
        readonly mensual: number;
        readonly anual: number;
    };
    readonly produccionSolar: {
        readonly mensual: number;
        readonly anual: number;
    };
    readonly capacidadFotovoltaica: {
        readonly recomendada: number;
        readonly instalada: number | null;
    };
    readonly ahorroEconomico: number;
    readonly emisionesCarbono: {
        readonly kg: number;
        readonly toneladas: number;
    };
    readonly simulacionesPorTipoBeneficiario: readonly {
        readonly beneficiario: string;
        readonly total: number;
    }[];
    readonly fechaActualizacion: string;
}

/**
 * DTO de la respuesta de `GET /api/v1/analytics/municipalities`.
 */
export interface respuestaEstadisticasMunicipiosDto
{
    readonly mensaje: string;
    readonly estadisticas: estadisticasMunicipiosDto;
}
