import Simulacion = require('./simulacion.entidad');

/**
 * Página del historial de simulaciones con el total de registros disponibles,
 * para que el cliente pueda calcular el número de páginas.
 */
class HistorialSimulaciones
{
    constructor
    (
        public readonly total: number,
        public readonly pagina: number,
        public readonly limite: number,
        public readonly simulaciones: readonly Simulacion[],
    )
    {
    }
}

export = HistorialSimulaciones;
