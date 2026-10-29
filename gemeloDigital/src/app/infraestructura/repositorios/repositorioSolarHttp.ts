import { inject, Injectable } from '@angular/core';
import { produccionSolar } from '../../dominio/entidades/produccionSolar.entidad';
import { radiacionSolar } from '../../dominio/entidades/radiacionSolar.entidad';
import {
    repositorioSolar,
    solicitudProduccionSolar,
    solicitudRadiacionSolar,
} from '../../aplicacion/puertos/repositorioSolar';
import { respuestaProduccionSolarDto } from '../dto/respuestaProduccionSolar.dto';
import { respuestaRadiacionSolarDto } from '../dto/respuestaRadiacionSolar.dto';
import { clienteApi } from '../http/clienteApi';
import { solarMapeador } from '../mapeadores/solar.mapeador';

/**
 * Adaptador HTTP del puerto solar.
 */
@Injectable({ providedIn: 'root' })
export class repositorioSolarHttp extends repositorioSolar
{
    private readonly cliente = inject(clienteApi);

    async obtenerRadiacion(solicitud: solicitudRadiacionSolar): Promise<radiacionSolar>
    {
        const respuesta = await this.cliente.obtener<respuestaRadiacionSolarDto>(
            '/v1/solar/radiation',
            this.cliente.crearParametros({
                latitud: solicitud.latitud,
                longitud: solicitud.longitud,
                municipioId: solicitud.municipioId,
            }),
            'No se pudo consultar la radiación solar',
        );

        return solarMapeador.aDominioRadiacion(respuesta);
    }

    async calcularProduccion(solicitud: solicitudProduccionSolar): Promise<produccionSolar>
    {
        const respuesta = await this.cliente.obtener<respuestaProduccionSolarDto>(
            '/v1/solar/production',
            this.cliente.crearParametros({
                capacidadKwp: solicitud.capacidadKwp,
                eficiencia: solicitud.eficiencia,
                latitud: solicitud.latitud,
                longitud: solicitud.longitud,
                municipioId: solicitud.municipioId,
            }),
            'No se pudo calcular la producción solar',
        );

        return solarMapeador.aDominioProduccion(respuesta);
    }
}
