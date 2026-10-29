import { inject, Injectable } from '@angular/core';
import { resultadoFinanciero } from '../../dominio/entidades/resultadoFinanciero.entidad';
import { repositorioFinanciero } from '../../aplicacion/puertos/repositorioFinanciero';
import { respuestaResultadoFinancieroDto } from '../dto/respuestaResultadoFinanciero.dto';
import { clienteApi } from '../http/clienteApi';
import { financieroMapeador } from '../mapeadores/financiero.mapeador';

/**
 * Adaptador HTTP del puerto financiero.
 */
@Injectable({ providedIn: 'root' })
export class repositorioFinancieroHttp extends repositorioFinanciero
{
    private readonly cliente = inject(clienteApi);

    async estimar(
        inversionInicial: number,
        ahorroAnual: number,
        mantenimientoAnual: number,
        horizonteAnios: number,
        tasaDescuento: number,
    ): Promise<resultadoFinanciero>
    {
        const respuesta = await this.cliente.enviar<respuestaResultadoFinancieroDto>(
            '/v1/financial/estimate',
            {
                inversionInicial,
                ahorroAnual,
                mantenimientoAnual,
                horizonteAnios,
                tasaDescuento,
            },
            'No se pudo calcular la estimación financiera',
        );

        return financieroMapeador.aDominio(respuesta);
    }
}
