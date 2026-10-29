import { inject, Injectable } from '@angular/core';
import { catalogoTarifas } from '../../dominio/entidades/catalogoTarifas.entidad';
import { facturaEstimada } from '../../dominio/entidades/facturaEstimada.entidad';
import { riesgoDac } from '../../dominio/entidades/riesgoDac.entidad';
import { periodoFacturacion } from '../../dominio/objetosValor/periodoFacturacion';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';
import { repositorioElectricidad } from '../../aplicacion/puertos/repositorioElectricidad';
import { respuestaFacturaEstimadaDto } from '../dto/respuestaFacturaEstimada.dto';
import { respuestaRiesgoDacDto } from '../dto/respuestaRiesgoDac.dto';
import { respuestaTarifasDto } from '../dto/respuestaTarifas.dto';
import { clienteApi } from '../http/clienteApi';
import { electricidadMapeador } from '../mapeadores/electricidad.mapeador';

/**
 * Adaptador HTTP del puerto de electricidad.
 */
@Injectable({ providedIn: 'root' })
export class repositorioElectricidadHttp extends repositorioElectricidad
{
    private readonly cliente = inject(clienteApi);

    async listarTarifas(): Promise<catalogoTarifas>
    {
        const respuesta = await this.cliente.obtener<respuestaTarifasDto>(
            '/v1/electricity/tariffs',
            undefined,
            'No se pudieron obtener las tarifas',
        );

        return electricidadMapeador.aDominioCatalogo(respuesta);
    }

    async estimarFactura(
        tipoTarifa: tipoTarifa,
        consumoKwh: number,
        periodo: periodoFacturacion,
    ): Promise<facturaEstimada>
    {
        const respuesta = await this.cliente.enviar<respuestaFacturaEstimadaDto>(
            '/v1/electricity/estimate-bill',
            { tipoTarifa, consumoKwh, periodo },
            'No se pudo calcular la estimación de la factura',
        );

        return electricidadMapeador.aDominioFactura(respuesta);
    }

    async evaluarRiesgoDac(
        tipoTarifa: tipoTarifa,
        consumoPromedioMensualKwh: number,
        mesesHistoricos: number,
    ): Promise<riesgoDac>
    {
        const respuesta = await this.cliente.obtener<respuestaRiesgoDacDto>(
            '/v1/electricity/dac-risk',
            this.cliente.crearParametros({
                tipoTarifa,
                consumoPromedioMensualKwh,
                mesesHistoricos,
            }),
            'No se pudo evaluar el riesgo DAC',
        );

        return electricidadMapeador.aDominioRiesgo(respuesta);
    }
}
