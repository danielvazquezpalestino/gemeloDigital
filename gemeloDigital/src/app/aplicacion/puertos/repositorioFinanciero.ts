import { resultadoFinanciero } from '../../dominio/entidades/resultadoFinanciero.entidad';

/**
 * Puerto de acceso a la estimación financiera de sistemas solares.
 */
export abstract class repositorioFinanciero
{
    abstract estimar(
        inversionInicial: number,
        ahorroAnual: number,
        mantenimientoAnual: number,
        horizonteAnios: number,
        tasaDescuento: number,
    ): Promise<resultadoFinanciero>;
}
