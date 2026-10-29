import { inject, Injectable } from '@angular/core';
import { radiacionSolar } from '../../dominio/entidades/radiacionSolar.entidad';
import { errorApi } from '../../dominio/errores/errorApi';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioSolar } from '../puertos/repositorioSolar';

/**
 * Caso de uso: consultar la radiación solar de una ubicación.
 *
 * La API exige el par de coordenadas completo o, en su lugar, un municipio.
 */
@Injectable({ providedIn: 'root' })
export class obtenerRadiacionSolar
{
    private readonly repositorio = inject(repositorioSolar);

    async ejecutar(
        latitud: number | null = null,
        longitud: number | null = null,
        municipioId: number | null = null,
    ): Promise<radiacionSolar>
    {
        const tieneLatitud = latitud !== null && latitud !== undefined;
        const tieneLongitud = longitud !== null && longitud !== undefined;

        if (tieneLatitud !== tieneLongitud)
        {
            throw new errorApi(
                'Debe indicar la latitud y la longitud juntas, o bien un municipio',
            );
        }

        const municipioValidado = validadorEntrada.enteroOpcional(
            municipioId,
            'El municipio',
            { minimo: 1, maximo: 100000 },
        );

        if (!tieneLatitud && municipioValidado === null)
        {
            throw new errorApi('Debe indicar la latitud y la longitud, o bien un municipio');
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

        return this.repositorio.obtenerRadiacion({
            latitud: latitudValidada,
            longitud: longitudValidada,
            municipioId: municipioValidado,
        });
    }
}
