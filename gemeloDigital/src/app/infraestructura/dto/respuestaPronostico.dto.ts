/**
 * DTO de un registro meteorológico del pronóstico.
 */
export interface registroMeteorologicoDto
{
    readonly fecha: string;
    readonly temperatura: number | null;
    readonly nubosidad: number | null;
    readonly precipitacion: number | null;
    readonly radiacionSolar: number | null;
}

/**
 * DTO del pronóstico meteorológico.
 */
export interface pronosticoDto
{
    readonly proveedor: string;
    readonly latitud: number;
    readonly longitud: number;
    readonly dias: number;
    readonly zonaHoraria: string;
    readonly fechaConsulta: string;
    readonly registros: readonly registroMeteorologicoDto[];
}

/**
 * DTO de la respuesta de `GET /api/v1/weather/forecast`.
 */
export interface respuestaPronosticoDto
{
    readonly mensaje: string;
    readonly pronostico: pronosticoDto;
}
