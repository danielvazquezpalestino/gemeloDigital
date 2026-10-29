import { inject, Injectable } from '@angular/core';
import { resultadoFinanciero } from '../../dominio/entidades/resultadoFinanciero.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioFinanciero } from '../puertos/repositorioFinanciero';

/**
 * Caso de uso: estimar la rentabilidad financiera de un sistema solar.
 */
@Injectable({ providedIn: 'root' })
export class estimarFinanciero
{
    private readonly repositorio = inject(repositorioFinanciero);

    async ejecutar(
        inversionInicial: number,
        ahorroAnual: number,
        horizonteAnios: number,
        tasaDescuento: number,
        mantenimientoAnual = 0,
    ): Promise<resultadoFinanciero>
    {
        const inversionValidada = validadorEntrada.numeroObligatorio(
            inversionInicial,
            'La inversión inicial',
            { minimo: 0, minimoExclusivo: true, maximo: 1000000000 },
        );
        const ahorroValidado = validadorEntrada.numeroObligatorio(ahorroAnual, 'El ahorro anual', {
            minimo: 0,
            maximo: 1000000000,
        });
        const mantenimientoValidado = validadorEntrada.numeroObligatorio(
            mantenimientoAnual,
            'El mantenimiento anual',
            { minimo: 0, maximo: 1000000000 },
        );
        const horizonteValidado = validadorEntrada.enteroObligatorio(
            horizonteAnios,
            'El horizonte de años',
            { minimo: 1, maximo: 50 },
        );
        const tasaValidada = validadorEntrada.numeroObligatorio(
            tasaDescuento,
            'La tasa de descuento',
            { minimo: 0, maximo: 1 },
        );

        return this.repositorio.estimar(
            inversionValidada,
            ahorroValidado,
            mantenimientoValidado,
            horizonteValidado,
            tasaValidada,
        );
    }
}
