import { simulacionSolar } from './simulacionSolar.entidad';

/**
 * Resultado paginado del historial de simulaciones solares.
 */
export class consultaSimulaciones
{
    constructor
    (
        public readonly total: number,
        public readonly pagina: number,
        public readonly limite: number,
        public readonly simulaciones: readonly simulacionSolar[],
    )
    {
    }
}
