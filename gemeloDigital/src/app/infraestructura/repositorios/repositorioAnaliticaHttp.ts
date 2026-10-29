import { inject, Injectable } from '@angular/core';
import { estadisticasMunicipios } from '../../dominio/entidades/estadisticasMunicipios.entidad';
import { repositorioAnalitica } from '../../aplicacion/puertos/repositorioAnalitica';
import { respuestaEstadisticasMunicipiosDto } from '../dto/respuestaEstadisticasMunicipios.dto';
import { clienteApi } from '../http/clienteApi';
import { estadisticasMunicipiosMapeador } from '../mapeadores/estadisticasMunicipios.mapeador';

/**
 * Adaptador HTTP del puerto de analítica.
 */
@Injectable({ providedIn: 'root' })
export class repositorioAnaliticaHttp extends repositorioAnalitica
{
    private readonly cliente = inject(clienteApi);

    async obtenerEstadisticas(
        municipioId: number | null,
        periodoDias: number | null,
    ): Promise<estadisticasMunicipios>
    {
        const respuesta = await this.cliente.obtener<respuestaEstadisticasMunicipiosDto>(
            '/v1/analytics/municipalities',
            this.cliente.crearParametros({
                municipality: municipioId,
                period: periodoDias,
            }),
            'No se pudieron obtener las estadísticas de municipios',
        );

        return estadisticasMunicipiosMapeador.aDominio(respuesta);
    }
}
