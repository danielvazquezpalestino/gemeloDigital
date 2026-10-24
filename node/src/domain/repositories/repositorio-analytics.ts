import DtoConsultarEstadisticas = require('../entities/dtos/analytics/consultar-estadisticas.dto');
import EstadisticasMunicipios = require('../entities/estadisticas-municipios.entidad');

/**
 * Puerto (contrato) del módulo de analítica: obtención de estadísticas
 * agregadas por municipio.
 */
abstract class RepositorioAnalytics
{
    abstract obtenerEstadisticas(filtros: DtoConsultarEstadisticas): Promise<EstadisticasMunicipios>;
}

export = RepositorioAnalytics;
