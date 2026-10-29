import { flujoFinancieroAnual } from './flujoFinancieroAnual.entidad';

/**
 * Resultado de la estimación financiera de un sistema solar.
 */
export class resultadoFinanciero
{
    constructor
    (
        public readonly inversionInicial: number,
        public readonly ahorroAnual: number,
        public readonly mantenimientoAnual: number,
        public readonly flujoNetoAnual: number,
        public readonly horizonteAnios: number,
        public readonly tasaDescuento: number,
        public readonly moneda: string,
        public readonly incluyeIva: boolean,
        public readonly convencionFlujos: string,
        public readonly flujosAnuales: readonly flujoFinancieroAnual[],
        public readonly recuperacionAnios: number | null,
        public readonly roiPorcentaje: number,
        public readonly vpn: number,
        public readonly tirPorcentaje: number | null,
        public readonly advertencias: readonly string[],
    )
    {
    }
}
