/**
 * DTO de un requisito de incentivo.
 */
export interface requisitoIncentivoDto
{
    readonly campo: string;
    readonly descripcion: string;
    readonly verificado: boolean;
    readonly requerido: boolean;
    readonly valor: number | null;
}

/**
 * DTO de un beneficio de incentivo.
 */
export interface beneficioIncentivoDto
{
    readonly tipo: string;
    readonly monto: number | null;
    readonly porcentaje: number | null;
    readonly moneda: string;
}

/**
 * DTO de un incentivo.
 */
export interface incentivoDto
{
    readonly id: number;
    readonly programa: string;
    readonly nombre: string;
    readonly descripcion: string;
    readonly beneficiarios: readonly string[];
    readonly municipioId: number | null;
    readonly requisitos: readonly requisitoIncentivoDto[];
    readonly beneficios: readonly beneficioIncentivoDto[];
    readonly vigenciaDesde: string | null;
    readonly vigenciaHasta: string | null;
    readonly organismoResponsable: string | null;
    readonly fuenteOficial: string | null;
    readonly verificado: boolean;
}

/**
 * DTO de la respuesta de `GET /api/v1/incentives`.
 */
export interface respuestaIncentivosDto
{
    readonly mensaje: string;
    readonly total: number;
    readonly pagina: number;
    readonly limite: number;
    readonly incentivos: readonly incentivoDto[];
}
