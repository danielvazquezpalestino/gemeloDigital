import { inject, Injectable } from '@angular/core';
import { pronostico } from '../../dominio/entidades/pronostico.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioClima } from '../puertos/repositorioClima';

/**
 * Caso de uso: obtener el pronóstico meteorológico de una ubicación.
 */
@Injectable({ providedIn: 'root' })
export class obtenerPronosticoMeteorologico
{
    private readonly repositorio = inject(repositorioClima);

    async ejecutar(latitud: number, longitud: number, dias = 7): Promise<pronostico>
    {
        const latitudValidada = validadorEntrada.numeroObligatorio(latitud, 'La latitud', {
            minimo: -90,
            maximo: 90,
        });
        const longitudValidada = validadorEntrada.numeroObligatorio(longitud, 'La longitud', {
            minimo: -180,
            maximo: 180,
        });
        const diasValidados = validadorEntrada.enteroObligatorio(dias, 'Los días', {
            minimo: 1,
            maximo: 16,
        });

        return this.repositorio.obtenerPronostico(latitudValidada, longitudValidada, diasValidados);
    }
}
