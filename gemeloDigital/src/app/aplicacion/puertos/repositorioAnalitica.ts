import { estadisticasMunicipios } from '../../dominio/entidades/estadisticasMunicipios.entidad';

/**
 * Puerto de acceso a las estadísticas agregadas por municipio.
 */
export abstract class repositorioAnalitica
{
    abstract obtenerEstadisticas(
        municipioId: number | null,
        periodoDias: number | null,
    ): Promise<estadisticasMunicipios>;
}
