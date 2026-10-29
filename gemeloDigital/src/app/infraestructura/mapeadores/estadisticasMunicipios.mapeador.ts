import { estadisticasMunicipios } from '../../dominio/entidades/estadisticasMunicipios.entidad';
import { respuestaEstadisticasMunicipiosDto } from '../dto/respuestaEstadisticasMunicipios.dto';
import { fechaMapeador } from './fecha.mapeador';

/**
 * Traduce el DTO de estadísticas a la entidad de dominio.
 */
export class estadisticasMunicipiosMapeador
{
    static aDominio(dto: respuestaEstadisticasMunicipiosDto): estadisticasMunicipios
    {
        const estadisticas = dto.estadisticas;

        return new estadisticasMunicipios(
            estadisticas.municipioId,
            estadisticas.simulaciones,
            estadisticas.instalacionesRegistradas,
            estadisticas.consumoElectrico,
            estadisticas.produccionSolar,
            estadisticas.capacidadFotovoltaica,
            estadisticas.ahorroEconomico,
            estadisticas.emisionesCarbono,
            estadisticas.simulacionesPorTipoBeneficiario,
            fechaMapeador.aFecha(estadisticas.fechaActualizacion),
        );
    }
}
