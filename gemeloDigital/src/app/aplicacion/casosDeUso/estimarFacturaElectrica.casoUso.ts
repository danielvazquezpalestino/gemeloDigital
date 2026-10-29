import { inject, Injectable } from '@angular/core';
import { facturaEstimada } from '../../dominio/entidades/facturaEstimada.entidad';
import { periodoFacturacion } from '../../dominio/objetosValor/periodoFacturacion';
import { tipoTarifa } from '../../dominio/objetosValor/tipoTarifa';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioElectricidad } from '../puertos/repositorioElectricidad';

/**
 * Caso de uso: estimar la factura eléctrica de un consumo.
 */
@Injectable({ providedIn: 'root' })
export class estimarFacturaElectrica
{
    private readonly repositorio = inject(repositorioElectricidad);

    async ejecutar(
        tipoTarifaSolicitada: tipoTarifa,
        consumoKwh: number,
        periodoSolicitado: periodoFacturacion = 'MENSUAL',
    ): Promise<facturaEstimada>
    {
        const tipoTarifaValidado = validadorEntrada.tipoTarifaObligatorio(tipoTarifaSolicitada);
        const consumoValidado = validadorEntrada.numeroObligatorio(consumoKwh, 'El consumo', {
            minimo: 0,
            minimoExclusivo: true,
            maximo: 10000000,
        });
        const periodoValidado = validadorEntrada.periodoFacturacionOpcional(periodoSolicitado);

        return this.repositorio.estimarFactura(
            tipoTarifaValidado,
            consumoValidado,
            periodoValidado,
        );
    }
}
