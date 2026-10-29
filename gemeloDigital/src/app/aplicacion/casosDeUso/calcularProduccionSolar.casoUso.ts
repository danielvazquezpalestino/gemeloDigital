import { inject, Injectable } from '@angular/core';
import { produccionSolar } from '../../dominio/entidades/produccionSolar.entidad';
import { errorApi } from '../../dominio/errores/errorApi';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioSolar } from '../puertos/repositorioSolar';

/**
 * Caso de uso: calcular la producción solar estimada para una capacidad.
 */
@Injectable({ providedIn: 'root' })
export class calcularProduccionSolar
{
    private readonly repositorio = inject(repositorioSolar);

    async ejecutar(
        capacidadKwp: number,
        eficiencia: number | null = null,
        latitud: number | null = null,
        longitud: number | null = null,
        municipioId: number | null = null,
    ): Promise<produccionSolar>
    {
        const capacidadValidada = validadorEntrada.numeroObligatorio(
            capacidadKwp,
            'La capacidad instalada',
            { minimo: 0, minimoExclusivo: true, maximo: 100000 },
        );
        const eficienciaValidada = validadorEntrada.numeroOpcional(
            eficiencia,
            'La eficiencia',
            { minimo: 0, minimoExclusivo: true, maximo: 1 },
        ) ?? 0.8;

        const tieneLatitud = latitud !== null && latitud !== undefined;
        const tieneLongitud = longitud !== null && longitud !== undefined;

        if (tieneLatitud !== tieneLongitud)
        {
            throw new errorApi(
                'Debe indicar la latitud y la longitud juntas, o bien un municipio',
            );
        }

        const latitudValidada = tieneLatitud
            ? validadorEntrada.numeroObligatorio(latitud, 'La latitud', {
                minimo: -90,
                maximo: 90,
            })
            : null;
        const longitudValidada = tieneLongitud
            ? validadorEntrada.numeroObligatorio(longitud, 'La longitud', {
                minimo: -180,
                maximo: 180,
            })
            : null;
        const municipioValidado = validadorEntrada.enteroOpcional(
            municipioId,
            'El municipio',
            { minimo: 1, maximo: 100000 },
        );

        return this.repositorio.calcularProduccion({
            capacidadKwp: capacidadValidada,
            eficiencia: eficienciaValidada,
            latitud: latitudValidada,
            longitud: longitudValidada,
            municipioId: municipioValidado,
        });
    }
}
