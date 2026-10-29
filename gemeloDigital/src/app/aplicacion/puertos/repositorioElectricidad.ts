import { catalogoTarifas } from '../../dominio/entidades/catalogoTarifas.entidad';
import { facturaEstimada } from '../../dominio/entidades/facturaEstimada.entidad';
import { riesgoDac } from '../../dominio/entidades/riesgoDac.entidad';
import { periodoFacturacion } from '../../dominio/objetosValor/periodoFacturacion';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';

/**
 * Puerto de acceso a tarifas, facturación y riesgo DAC.
 */
export abstract class repositorioElectricidad
{
    abstract listarTarifas(): Promise<catalogoTarifas>;

    abstract estimarFactura(
        tipoTarifa: tipoTarifa,
        consumoKwh: number,
        periodo: periodoFacturacion,
    ): Promise<facturaEstimada>;

    abstract evaluarRiesgoDac(
        tipoTarifa: tipoTarifa,
        consumoPromedioMensualKwh: number,
        mesesHistoricos: number,
    ): Promise<riesgoDac>;
}
