import { simulacionDto } from './respuestaSimulacion.dto';

/**
 * DTO de la respuesta de `GET /api/v1/simulaciones`.
 */
export interface respuestaSimulacionesDto
{
    readonly mensaje: string;
    readonly total: number;
    readonly pagina: number;
    readonly limite: number;
    readonly simulaciones: readonly simulacionDto[];
}
