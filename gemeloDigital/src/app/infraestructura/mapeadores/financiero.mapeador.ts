import { flujoFinancieroAnual } from '../../dominio/entidades/flujoFinancieroAnual.entidad';
import { resultadoFinanciero } from '../../dominio/entidades/resultadoFinanciero.entidad';
import { respuestaResultadoFinancieroDto } from '../dto/respuestaResultadoFinanciero.dto';

/**
 * Traduce el DTO financiero a la entidad de dominio.
 */
export class financieroMapeador
{
    static aDominio(dto: respuestaResultadoFinancieroDto): resultadoFinanciero
    {
        const resultado = dto.resultado;

        return new resultadoFinanciero(
            resultado.inversionInicial,
            resultado.ahorroAnual,
            resultado.mantenimientoAnual,
            resultado.flujoNetoAnual,
            resultado.horizonteAnios,
            resultado.tasaDescuento,
            resultado.moneda,
            resultado.incluyeIva,
            resultado.convencionFlujos,
            resultado.flujosAnuales.map(
                (flujo) => new flujoFinancieroAnual(
                    flujo.anio,
                    flujo.flujoNeto,
                    flujo.flujoDescontado,
                    flujo.acumulado,
                ),
            ),
            resultado.recuperacionAnios,
            resultado.roiPorcentaje,
            resultado.vpn,
            resultado.tirPorcentaje,
            resultado.advertencias,
        );
    }
}
