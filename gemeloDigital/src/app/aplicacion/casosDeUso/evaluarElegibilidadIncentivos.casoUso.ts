import { inject, Injectable } from '@angular/core';
import { evaluacionElegibilidadIncentivos } from '../../dominio/entidades/evaluacionElegibilidadIncentivos.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import {
    repositorioIncentivos,
    solicitudElegibilidadIncentivos,
} from '../puertos/repositorioIncentivos';

/**
 * Caso de uso: evaluar qué incentivos podrían corresponder a un solicitante.
 */
@Injectable({ providedIn: 'root' })
export class evaluarElegibilidadIncentivos
{
    private readonly repositorio = inject(repositorioIncentivos);

    async ejecutar(
        solicitud: solicitudElegibilidadIncentivos,
    ): Promise<evaluacionElegibilidadIncentivos>
    {
        const tipoBeneficiarioValidado = validadorEntrada.tipoBeneficiarioObligatorio(
            solicitud.tipoBeneficiario,
        );
        const municipioValidado = validadorEntrada.textoObligatorio(
            solicitud.municipio,
            'El municipio',
            120,
        );
        const capacidadValidada = validadorEntrada.numeroOpcional(
            solicitud.capacidadSistemaKw,
            'La capacidad del sistema',
            { minimo: 0, minimoExclusivo: true, maximo: 100 },
        );
        const tipoInstalacionValidado = validadorEntrada.textoOpcional(
            solicitud.tipoInstalacion,
            'El tipo de instalación',
            120,
        );

        return this.repositorio.evaluarElegibilidad({
            tipoBeneficiario: tipoBeneficiarioValidado,
            municipio: municipioValidado,
            capacidadSistemaKw: capacidadValidada,
            tipoInstalacion: tipoInstalacionValidado,
        });
    }
}
