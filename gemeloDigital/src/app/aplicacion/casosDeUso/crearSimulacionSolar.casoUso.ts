import { inject, Injectable } from '@angular/core';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { datosCrearSimulacion, repositorioSimulaciones } from '../puertos/repositorioSimulaciones';

/**
 * Caso de uso: crear y registrar una simulación solar.
 */
@Injectable({ providedIn: 'root' })
export class crearSimulacionSolar
{
    private readonly repositorio = inject(repositorioSimulaciones);

    async ejecutar(datos: datosCrearSimulacion): Promise<simulacionSolar>
    {
        const municipioValidado = validadorEntrada.enteroObligatorio(
            datos.municipioId,
            'El municipio',
            { minimo: 1, maximo: 100000 },
        );
        const consumoValidado = validadorEntrada.numeroObligatorio(
            datos.consumoKwh,
            'El consumo',
            { minimo: 0, minimoExclusivo: true, maximo: 10000000 },
        );
        const tarifaValidada = validadorEntrada.numeroObligatorio(
            datos.tarifaCfe,
            'La tarifa de CFE',
            { minimo: 0, minimoExclusivo: true, maximo: 1000 },
        );
        const areaValidada = validadorEntrada.numeroOpcional(
            datos.areaDisponibleM2,
            'El área disponible',
            { minimo: 0, minimoExclusivo: true, maximo: 1000000 },
        );
        const tipoTarifaValidado = validadorEntrada.tipoTarifaObligatorio(
            datos.tipoTarifa ?? 'PDBT',
        );
        const incluyeBateriasValidado = validadorEntrada.booleanoOpcional(
            datos.incluyeBaterias,
            'La inclusión de baterías',
            false,
        );

        return this.repositorio.crear({
            municipioId: municipioValidado,
            consumoKwh: consumoValidado,
            tarifaCfe: tarifaValidada,
            areaDisponibleM2: areaValidada,
            tipoTarifa: tipoTarifaValidado,
            incluyeBaterias: incluyeBateriasValidado,
        });
    }
}
