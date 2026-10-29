import { inject, Injectable } from '@angular/core';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import { errorApi } from '../../dominio/errores/errorApi';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { cambiosSimulacion, repositorioSimulaciones } from '../puertos/repositorioSimulaciones';

/**
 * Caso de uso: recalcular una simulación solar con cambios parciales.
 */
@Injectable({ providedIn: 'root' })
export class recalcularSimulacionSolar
{
    private readonly repositorio = inject(repositorioSimulaciones);

    async ejecutar(id: number, cambios: cambiosSimulacion): Promise<simulacionSolar>
    {
        const idValidado = validadorEntrada.enteroObligatorio(id, 'El identificador', {
            minimo: 0,
            minimoExclusivo: true,
        });
        const cambiosNormalizados = this.normalizarCambios(cambios);

        if (Object.keys(cambiosNormalizados).length === 0)
        {
            throw new errorApi('Debe enviar al menos un campo para recalcular la simulación');
        }

        return this.repositorio.recalcular(idValidado, cambiosNormalizados);
    }

    private normalizarCambios(cambios: cambiosSimulacion): cambiosSimulacion
    {
        const normalizados: cambiosSimulacion = {};

        if (cambios.municipioId !== undefined)
        {
            normalizados.municipioId = validadorEntrada.enteroObligatorio(
                cambios.municipioId,
                'El municipio',
                { minimo: 1, maximo: 100000 },
            );
        }

        if (cambios.consumoKwh !== undefined)
        {
            normalizados.consumoKwh = validadorEntrada.numeroObligatorio(
                cambios.consumoKwh,
                'El consumo',
                { minimo: 0, minimoExclusivo: true, maximo: 10000000 },
            );
        }

        if (cambios.tarifaCfe !== undefined)
        {
            normalizados.tarifaCfe = validadorEntrada.numeroObligatorio(
                cambios.tarifaCfe,
                'La tarifa de CFE',
                { minimo: 0, minimoExclusivo: true, maximo: 1000 },
            );
        }

        if (cambios.areaDisponibleM2 !== undefined)
        {
            normalizados.areaDisponibleM2 = cambios.areaDisponibleM2 === null
                ? null
                : validadorEntrada.numeroObligatorio(
                    cambios.areaDisponibleM2,
                    'El área disponible',
                    { minimo: 0, minimoExclusivo: true, maximo: 1000000 },
                );
        }

        if (cambios.tipoTarifa !== undefined)
        {
            normalizados.tipoTarifa = cambios.tipoTarifa === null
                ? null
                : validadorEntrada.tipoTarifaObligatorio(cambios.tipoTarifa);
        }

        if (cambios.incluyeBaterias !== undefined)
        {
            normalizados.incluyeBaterias = this.normalizarBooleano(cambios.incluyeBaterias);
        }

        return normalizados;
    }

    private normalizarBooleano(valor: boolean | null): boolean | null
    {
        if (valor === null)
        {
            return null;
        }

        if (typeof valor !== 'boolean')
        {
            throw new errorApi('La inclusión de baterías debe ser verdadero o falso');
        }

        return valor;
    }
}
