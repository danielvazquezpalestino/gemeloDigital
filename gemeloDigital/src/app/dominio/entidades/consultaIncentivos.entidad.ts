import { incentivo } from './incentivo.entidad';

/**
 * Resultado paginado de la consulta de incentivos.
 */
export class consultaIncentivos
{
    constructor
    (
        public readonly total: number,
        public readonly pagina: number,
        public readonly limite: number,
        public readonly incentivos: readonly incentivo[],
    )
    {
    }
}
