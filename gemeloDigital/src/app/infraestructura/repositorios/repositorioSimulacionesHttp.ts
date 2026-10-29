import { inject, Injectable } from '@angular/core';
import { consultaSimulaciones } from '../../dominio/entidades/consultaSimulaciones.entidad';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import {
    cambiosSimulacion,
    datosCrearSimulacion,
    filtrosSimulaciones,
    repositorioSimulaciones,
} from '../../aplicacion/puertos/repositorioSimulaciones';
import { respuestaSimulacionDto } from '../dto/respuestaSimulacion.dto';
import { respuestaSimulacionesDto } from '../dto/respuestaSimulaciones.dto';
import { clienteApi } from '../http/clienteApi';
import { simulacionesMapeador } from '../mapeadores/simulaciones.mapeador';

/**
 * Adaptador HTTP del puerto de simulaciones solares.
 */
@Injectable({ providedIn: 'root' })
export class repositorioSimulacionesHttp extends repositorioSimulaciones
{
    private readonly cliente = inject(clienteApi);

    async crear(datos: datosCrearSimulacion): Promise<simulacionSolar>
    {
        const respuesta = await this.cliente.enviar<respuestaSimulacionDto>(
            '/v1/simulaciones',
            {
                municipioId: datos.municipioId,
                consumoKwh: datos.consumoKwh,
                tarifaCfe: datos.tarifaCfe,
                areaDisponibleM2: datos.areaDisponibleM2 ?? null,
                tipoTarifa: datos.tipoTarifa ?? 'PDBT',
                incluyeBaterias: datos.incluyeBaterias ?? false,
            },
            'No se pudo crear la simulación solar',
        );

        return simulacionesMapeador.aDominio(respuesta);
    }

    async listar(filtros: filtrosSimulaciones): Promise<consultaSimulaciones>
    {
        const respuesta = await this.cliente.obtener<respuestaSimulacionesDto>(
            '/v1/simulaciones',
            this.cliente.crearParametros({
                municipioId: filtros.municipioId,
                pagina: filtros.pagina,
                limite: filtros.limite,
            }),
            'No se pudieron obtener las simulaciones',
        );

        return simulacionesMapeador.aDominioConsulta(respuesta);
    }

    async obtener(id: number): Promise<simulacionSolar>
    {
        const respuesta = await this.cliente.obtener<respuestaSimulacionDto>(
            `/v1/simulaciones/${id}`,
            undefined,
            'No se pudo obtener la simulación solar',
        );

        return simulacionesMapeador.aDominio(respuesta);
    }

    async eliminar(id: number): Promise<void>
    {
        await this.cliente.eliminar<{ readonly mensaje: string }>(
            `/v1/simulaciones/${id}`,
            'No se pudo eliminar la simulación solar',
        );
    }

    async recalcular(id: number, cambios: cambiosSimulacion): Promise<simulacionSolar>
    {
        const respuesta = await this.cliente.enviar<respuestaSimulacionDto>(
            `/v1/simulaciones/${id}/recalcular`,
            this.construirCambios(cambios),
            'No se pudo recalcular la simulación solar',
        );

        return simulacionesMapeador.aDominio(respuesta);
    }

    private construirCambios(cambios: cambiosSimulacion): Record<string, unknown>
    {
        const cuerpo: Record<string, unknown> = {};

        if (cambios.municipioId !== undefined)
        {
            cuerpo['municipioId'] = cambios.municipioId;
        }

        if (cambios.consumoKwh !== undefined)
        {
            cuerpo['consumoKwh'] = cambios.consumoKwh;
        }

        if (cambios.tarifaCfe !== undefined)
        {
            cuerpo['tarifaCfe'] = cambios.tarifaCfe;
        }

        if (cambios.areaDisponibleM2 !== undefined)
        {
            cuerpo['areaDisponibleM2'] = cambios.areaDisponibleM2;
        }

        if (cambios.tipoTarifa !== undefined)
        {
            cuerpo['tipoTarifa'] = cambios.tipoTarifa;
        }

        if (cambios.incluyeBaterias !== undefined)
        {
            cuerpo['incluyeBaterias'] = cambios.incluyeBaterias;
        }

        return cuerpo;
    }
}
