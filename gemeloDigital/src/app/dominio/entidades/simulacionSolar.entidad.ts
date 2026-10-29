import { tipoTarifa } from '../objetosValor/tipoTarifa';

/**
 * Simulación solar registrada en la base de datos.
 */
export class simulacionSolar
{
    constructor
    (
        public readonly id: number,
        public readonly municipioId: number,
        public readonly consumoKwh: number,
        public readonly tarifaCfe: number,
        public readonly areaDisponibleM2: number | null,
        public readonly tipoTarifa: tipoTarifa,
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
