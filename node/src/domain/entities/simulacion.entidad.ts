import TipoTarifa = require('./tipo-tarifa');

/**
 * Simulación solar ya calculada y persistida.
 *
 * Los campos de entrada (`municipioId`, `consumoKwh`, `tarifaCfe`,
 * `areaDisponibleM2`, `tipoTarifa`, `incluyeBaterias`) son los que declara el
 * cliente; los campos de salida los determina el modelo de cálculo.
 */
class Simulacion
{
    constructor
    (
        public readonly id: number,
        public readonly municipioId: number,
        public readonly consumoKwh: number,
        public readonly tarifaCfe: number,
        public readonly areaDisponibleM2: number | null,
        public readonly tipoTarifa: TipoTarifa,
        public readonly incluyeBaterias: boolean,
        public readonly panelesNecesarios: number,
        public readonly produccionAnual: number,
        public readonly ahorroEstimado: number,
        public readonly costoInversionTotal: number,
        public readonly retornoInversionAnios: number,
        public readonly advertencias: readonly string[],
        public readonly fechaCreacion: Date,
        public readonly fechaActualizacion: Date,
    )
    {
    }
}

export = Simulacion;
