/**
 * DTO de la evaluación del riesgo DAC.
 */
export interface riesgoDacDto
{
    readonly nivelRiesgo: string;
    readonly tipoTarifa: string;
    readonly puedeDeterminarse: boolean;
    readonly motivo: string;
    readonly consumoPromedioMensualKwh: number;
    readonly mesesHistoricos: number;
    readonly umbralMensualKwh: number | null;
    readonly indiceSobreUmbral: number | null;
    readonly esDemostracion: boolean;
    readonly determinacionOficial: boolean;
    readonly advertencias: readonly string[];
}

/**
 * DTO de la respuesta de `GET /api/v1/electricity/dac-risk`.
 */
export interface respuestaRiesgoDacDto
{
    readonly mensaje: string;
    readonly evaluacion: riesgoDacDto;
}
