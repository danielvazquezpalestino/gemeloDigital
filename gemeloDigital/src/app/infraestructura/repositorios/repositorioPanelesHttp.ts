import { inject, Injectable } from '@angular/core';
import { catalogoPaneles } from '../../dominio/entidades/catalogoPaneles.entidad';
import { repositorioPaneles } from '../../aplicacion/puertos/repositorioPaneles';
import { respuestaPanelesDto } from '../dto/respuestaPaneles.dto';
import { clienteApi } from '../http/clienteApi';
import { panelesMapeador } from '../mapeadores/paneles.mapeador';

/**
 * Adaptador HTTP del puerto de paneles solares.
 */
@Injectable({ providedIn: 'root' })
export class repositorioPanelesHttp extends repositorioPaneles
{
    private readonly cliente = inject(clienteApi);

    async listar(
        fabricante: string | null,
        potenciaMinimaWatts: number | null,
    ): Promise<catalogoPaneles>
    {
        const respuesta = await this.cliente.obtener<respuestaPanelesDto>(
            '/v1/panels',
            this.cliente.crearParametros({
                fabricante,
                potenciaMinimaWatts,
            }),
            'No se pudieron obtener los paneles',
        );

        return panelesMapeador.aDominio(respuesta);
    }
}
