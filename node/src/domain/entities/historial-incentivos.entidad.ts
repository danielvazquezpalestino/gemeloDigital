import Incentivo = require('./incentivo.entidad');

/**
 * Página del historial de incentivos con el total de registros disponibles,
 * para que el cliente pueda calcular el número de páginas.
 */
class HistorialIncentivos
{
    constructor
    (
        public readonly total: number,
        public readonly pagina: number,
        public readonly limite: number,
        public readonly incentivos: readonly Incentivo[],
    )
    {
    }
}

export = HistorialIncentivos;
