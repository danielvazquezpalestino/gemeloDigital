import { inject, Injectable } from '@angular/core';
import { pronostico } from '../../dominio/entidades/pronostico.entidad';
import { repositorioClima } from '../../aplicacion/puertos/repositorioClima';
import { respuestaPronosticoDto } from '../dto/respuestaPronostico.dto';
import { clienteApi } from '../http/clienteApi';
import { pronosticoMapeador } from '../mapeadores/pronostico.mapeador';

/**
 * Adaptador HTTP del puerto de clima.
 */
@Injectable({ providedIn: 'root' })
export class repositorioClimaHttp extends repositorioClima
{
    private readonly cliente = inject(clienteApi);

    async obtenerPronostico(latitud: number, longitud: number, dias: number): Promise<pronostico>
    {
        const respuesta = await this.cliente.obtener<respuestaPronosticoDto>(
            '/v1/weather/forecast',
            this.cliente.crearParametros({
                latitude: latitud,
                longitude: longitud,
                days: dias,
            }),
            'No se pudo obtener el pronóstico meteorológico',
        );

        return pronosticoMapeador.aDominio(respuesta);
    }
}
