/**
 * DTO de la producción solar estimada.
 */
export interface produccionSolarDto
{
    readonly capacidadKwp: number;
    readonly eficiencia: number;
    readonly radiacionKwhM2Dia: number;
    readonly produccionMensualKwh: number;
    readonly produccionAnualKwh: number;
    readonly esEstimacion: boolean;
    readonly fuenteRadiacion: string;
}

/**
 * DTO de la respuesta de `GET /api/v1/solar/production`.
 */
export interface respuestaProduccionSolarDto
{
    readonly mensaje: string;
    readonly produccion: produccionSolarDto;
}
