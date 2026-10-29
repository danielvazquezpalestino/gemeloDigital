/**
 * DTO de un panel solar del catálogo.
 */
export interface panelSolarDto
{
    readonly id: string;
    readonly fabricante: string;
    readonly modelo: string;
    readonly potenciaWatts: number;
    readonly eficienciaPorcentaje: number;
    readonly tecnologia: string;
    readonly garantiaAnios: number;
    readonly anchoMetros: number;
    readonly altoMetros: number;
    readonly descripcion: string;
    readonly esDemostracion: boolean;
}

/**
 * DTO de la respuesta de `GET /api/v1/panels`.
 */
export interface respuestaPanelesDto
{
    readonly mensaje: string;
    readonly esDemostracion: boolean;
    readonly advertencia: string;
    readonly paneles: readonly panelSolarDto[];
}
