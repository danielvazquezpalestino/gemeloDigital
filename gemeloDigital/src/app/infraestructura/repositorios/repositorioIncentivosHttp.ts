import { inject, Injectable } from '@angular/core';
import { consultaIncentivos } from '../../dominio/entidades/consultaIncentivos.entidad';
import { evaluacionElegibilidadIncentivos } from '../../dominio/entidades/evaluacionElegibilidadIncentivos.entidad';
import {
    filtrosIncentivos,
    repositorioIncentivos,
    solicitudElegibilidadIncentivos,
} from '../../aplicacion/puertos/repositorioIncentivos';
import { respuestaElegibilidadDto } from '../dto/respuestaElegibilidad.dto';
import { respuestaIncentivosDto } from '../dto/respuestaIncentivos.dto';
import { clienteApi } from '../http/clienteApi';
import { incentivosMapeador } from '../mapeadores/incentivos.mapeador';

/**
 * Adaptador HTTP del puerto de incentivos.
 */
@Injectable({ providedIn: 'root' })
export class repositorioIncentivosHttp extends repositorioIncentivos
{
    private readonly cliente = inject(clienteApi);

    async consultar(filtros: filtrosIncentivos): Promise<consultaIncentivos>
    {
        const respuesta = await this.cliente.obtener<respuestaIncentivosDto>(
            '/v1/incentives',
            this.cliente.crearParametros({
                beneficiaryType: filtros.tipoBeneficiario,
                municipality: filtros.municipio,
                status: filtros.estado,
                pagina: filtros.pagina,
                limite: filtros.limite,
            }),
            'No se pudieron obtener los incentivos',
        );

        return incentivosMapeador.aDominioConsulta(respuesta);
    }

    async evaluarElegibilidad(
        solicitud: solicitudElegibilidadIncentivos,
    ): Promise<evaluacionElegibilidadIncentivos>
    {
        const respuesta = await this.cliente.obtener<respuestaElegibilidadDto>(
            '/v1/incentives/eligibility',
            this.cliente.crearParametros({
                beneficiaryType: solicitud.tipoBeneficiario,
                municipality: solicitud.municipio,
                systemCapacityKw: solicitud.capacidadSistemaKw,
                installationType: solicitud.tipoInstalacion,
            }),
            'No se pudo evaluar la elegibilidad de los incentivos',
        );

        return incentivosMapeador.aDominioElegibilidad(respuesta);
    }
}
