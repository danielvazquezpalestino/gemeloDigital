/**
 * DTO de un flujo financiero anual.
 */
export interface flujoFinancieroAnualDto
{
    readonly anio: number;
    readonly flujoNeto: number;
    readonly flujoDescontado: number;
    readonly acumulado: number;
}

/**
 * DTO del resultado financiero de una instalación solar.
 */
export interface resultadoFinancieroDto
{
    readonly inversionInicial: number;
    readonly ahorroAnual: number;
    readonly mantenimientoAnual: number;
    readonly flujoNetoAnual: number;
    readonly horizonteAnios: number;
    readonly tasaDescuento: number;
    readonly moneda: string;
    readonly incluyeIva: boolean;
    readonly convencionFlujos: string;
    readonly flujosAnuales: readonly flujoFinancieroAnualDto[];
    readonly recuperacionAnios: number | null;
    readonly roiPorcentaje: number;
    readonly vpn: number;
    readonly tirPorcentaje: number | null;
    readonly advertencias: readonly string[];
}

/**
 * DTO de la respuesta de `POST /api/v1/financial/estimate`.
 */
export interface respuestaResultadoFinancieroDto
{
    readonly mensaje: string;
    readonly resultado: resultadoFinancieroDto;
}
