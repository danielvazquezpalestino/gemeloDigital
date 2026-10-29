import { inject, Injectable } from '@angular/core';
import { riesgoDac } from '../../dominio/entidades/riesgoDac.entidad';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioElectricidad } from '../puertos/repositorioElectricidad';

/**
 * Caso de uso: evaluar el riesgo de caer en la tarifa DAC.
 */
@Injectable({ providedIn: 'root' })
export class evaluarRiesgoDac
{
    private readonly repositorio = inject(repositorioElectricidad);

    async ejecutar(
        tipoTarifaSolicitada: tipoTarifa,
        consumoPromedioMensualKwh: number,
        mesesHistoricos = 12,
    ): Promise<riesgoDac>
    {
        const tipoTarifaValidado = validadorEntrada.tipoTarifaObligatorio(tipoTarifaSolicitada);
        const consumoValidado = validadorEntrada.numeroObligatorio(
            consumoPromedioMensualKwh,
            'El consumo promedio mensual',
            { minimo: 0, minimoExclusivo: true, maximo: 10000000 },
        );
        const mesesValidados = validadorEntrada.enteroObligatorio(
            mesesHistoricos,
            'Los meses históricos',
            { minimo: 1, maximo: 120 },
        );

        return this.repositorio.evaluarRiesgoDac(
            tipoTarifaValidado,
            consumoValidado,
            mesesValidados,
        );
    }
}
