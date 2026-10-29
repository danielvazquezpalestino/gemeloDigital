import { consultaSimulaciones } from '../../dominio/entidades/consultaSimulaciones.entidad';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';
import { respuestaSimulacionDto, simulacionDto } from '../dto/respuestaSimulacion.dto';
import { respuestaSimulacionesDto } from '../dto/respuestaSimulaciones.dto';
import { fechaMapeador } from './fecha.mapeador';

/**
 * Traduce los DTO de simulaciones solares a entidades de dominio.
 */
export class simulacionesMapeador
{
    static aDominio(dto: respuestaSimulacionDto): simulacionSolar
    {
        return this.aDominioSimulacion(dto.simulacion);
    }

    static aDominioConsulta(dto: respuestaSimulacionesDto): consultaSimulaciones
    {
        return new consultaSimulaciones(
            dto.total,
            dto.pagina,
            dto.limite,
            dto.simulaciones.map((simulacion) => this.aDominioSimulacion(simulacion)),
        );
    }

    private static aDominioSimulacion(dto: simulacionDto): simulacionSolar
    {
        return new simulacionSolar(
            dto.id,
            dto.municipioId,
            dto.consumoKwh,
            dto.tarifaCfe,
            dto.areaDisponibleM2,
            dto.tipoTarifa as tipoTarifa,
            dto.incluyeBaterias,
            dto.panelesNecesarios,
            dto.produccionAnual,
            dto.ahorroEstimado,
            dto.costoInversionTotal,
            dto.retornoInversionAnios,
            dto.advertencias,
            fechaMapeador.aFecha(dto.fechaCreacion),
            fechaMapeador.aFecha(dto.fechaActualizacion),
        );
    }
}
