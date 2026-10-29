import { produccionSolar } from '../../dominio/entidades/produccionSolar.entidad';
import { radiacionSolar } from '../../dominio/entidades/radiacionSolar.entidad';
import { respuestaProduccionSolarDto } from '../dto/respuestaProduccionSolar.dto';
import { respuestaRadiacionSolarDto } from '../dto/respuestaRadiacionSolar.dto';

/**
 * Traduce los DTO del módulo solar a entidades de dominio.
 */
export class solarMapeador
{
    static aDominioRadiacion(dto: respuestaRadiacionSolarDto): radiacionSolar
    {
        const radiacion = dto.radiacion;

        return new radiacionSolar(
            radiacion.latitud,
            radiacion.longitud,
            radiacion.municipioId,
            radiacion.radiacionKwhM2Dia,
            radiacion.esEstimacion,
            radiacion.fuente,
        );
    }

    static aDominioProduccion(dto: respuestaProduccionSolarDto): produccionSolar
    {
        const produccion = dto.produccion;

        return new produccionSolar(
            produccion.capacidadKwp,
            produccion.eficiencia,
            produccion.radiacionKwhM2Dia,
            produccion.produccionMensualKwh,
            produccion.produccionAnualKwh,
            produccion.esEstimacion,
            produccion.fuenteRadiacion,
        );
    }
}
