import { inject, Injectable } from '@angular/core';
import { estadisticasMunicipios } from '../../dominio/entidades/estadisticasMunicipios.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioAnalitica } from '../puertos/repositorioAnalitica';

/**
 * Caso de uso: obtener las estadísticas agregadas por municipio.
 */
@Injectable({ providedIn: 'root' })
export class obtenerEstadisticasMunicipios
{
    private readonly repositorio = inject(repositorioAnalitica);

    async ejecutar(
        municipioId: number | null = null,
        periodoDias: number | null = null,
    ): Promise<estadisticasMunicipios>
    {
        const municipioValidado = validadorEntrada.enteroOpcional(
            municipioId,
            'El municipio',
            { minimo: 1, maximo: 100000 },
        );
        const periodoValidado = validadorEntrada.enteroOpcional(
            periodoDias,
            'El periodo',
            { minimo: 1, maximo: 3650 },
        );

        return this.repositorio.obtenerEstadisticas(municipioValidado, periodoValidado);
    }
}
