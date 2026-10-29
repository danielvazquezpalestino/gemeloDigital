/**
 * DTO de la radiación solar estimada.
 */
export interface radiacionSolarDto
{
    readonly latitud: number | null;
    readonly longitud: number | null;
    readonly municipioId: number | null;
    readonly radiacionKwhM2Dia: number;
    readonly esEstimacion: boolean;
    readonly fuente: string;
}

/**
 * DTO de la respuesta de `GET /api/v1/solar/radiation`.
 */
export interface respuestaRadiacionSolarDto
{
    readonly mensaje: string;
    readonly radiacion: radiacionSolarDto;
}
