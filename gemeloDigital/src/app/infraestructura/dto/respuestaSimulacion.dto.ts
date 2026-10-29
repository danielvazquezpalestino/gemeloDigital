/**
 * DTO de una simulación solar.
 */
export interface simulacionDto
{
    readonly id: number;
    readonly municipioId: number;
    readonly consumoKwh: number;
    readonly tarifaCfe: number;
    readonly areaDisponibleM2: number | null;
    readonly tipoTarifa: string;
    readonly incluyeBaterias: boolean;
    readonly panelesNecesarios: number;
    readonly produccionAnual: number;
    readonly ahorroEstimado: number;
    readonly costoInversionTotal: number;
    readonly retornoInversionAnios: number;
    readonly advertencias: readonly string[];
    readonly fechaCreacion: string;
    readonly fechaActualizacion: string;
}

/**
 * DTO de las respuestas que devuelven una simulación.
 */
export interface respuestaSimulacionDto
{
    readonly mensaje: string;
    readonly simulacion: simulacionDto;
}
