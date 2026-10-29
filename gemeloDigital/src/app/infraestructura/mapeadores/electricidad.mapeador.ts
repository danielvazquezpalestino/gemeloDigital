import { bloqueConsumoTarifa } from '../../dominio/entidades/bloqueConsumoTarifa.entidad';
import { catalogoTarifas } from '../../dominio/entidades/catalogoTarifas.entidad';
import { facturaEstimada } from '../../dominio/entidades/facturaEstimada.entidad';
import { lineaFacturaEstimada } from '../../dominio/entidades/lineaFacturaEstimada.entidad';
import { riesgoDac } from '../../dominio/entidades/riesgoDac.entidad';
import { tarifaElectrica } from '../../dominio/entidades/tarifaElectrica.entidad';
import { nivelRiesgoDac } from '../../dominio/objetosValor/nivelRiesgoDac';
import { periodoFacturacion } from '../../dominio/objetosValor/periodoFacturacion';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';
import { respuestaFacturaEstimadaDto } from '../dto/respuestaFacturaEstimada.dto';
import { respuestaRiesgoDacDto } from '../dto/respuestaRiesgoDac.dto';
import { respuestaTarifasDto } from '../dto/respuestaTarifas.dto';

/**
 * Traduce los DTO del módulo de electricidad a entidades de dominio.
 */
export class electricidadMapeador
{
    static aDominioCatalogo(dto: respuestaTarifasDto): catalogoTarifas
    {
        return new catalogoTarifas(
            dto.esDemostracion,
            dto.advertencia,
            dto.tarifas.map(
                (tarifa) => new tarifaElectrica(
                    tarifa.codigo,
                    tarifa.nombre,
                    tarifa.descripcion,
                    tarifa.tipoUsuario,
                    tarifa.bloques.map(
                        (bloque) => new bloqueConsumoTarifa(bloque.hastaKwh, bloque.precioKwh),
                    ),
                    tarifa.esDemostracion,
                ),
            ),
        );
    }

    static aDominioFactura(dto: respuestaFacturaEstimadaDto): facturaEstimada
    {
        const factura = dto.factura;

        return new facturaEstimada(
            factura.tarifaCodigo,
            factura.tarifaNombre,
            factura.consumoKwh,
            factura.periodo as periodoFacturacion,
            factura.moneda,
            factura.desglose.map(
                (linea) => new lineaFacturaEstimada(
                    linea.concepto,
                    linea.cantidadKwh,
                    linea.precioKwh,
                    linea.subtotal,
                ),
            ),
            factura.totalEstimado,
            factura.esDemostracion,
            factura.supuestos,
        );
    }

    static aDominioRiesgo(dto: respuestaRiesgoDacDto): riesgoDac
    {
        const evaluacion = dto.evaluacion;

        return new riesgoDac(
            evaluacion.nivelRiesgo as nivelRiesgoDac,
            evaluacion.tipoTarifa as tipoTarifa,
            evaluacion.puedeDeterminarse,
            evaluacion.motivo,
            evaluacion.consumoPromedioMensualKwh,
            evaluacion.mesesHistoricos,
            evaluacion.umbralMensualKwh,
            evaluacion.indiceSobreUmbral,
            evaluacion.esDemostracion,
            evaluacion.determinacionOficial,
            evaluacion.advertencias,
        );
    }
}
