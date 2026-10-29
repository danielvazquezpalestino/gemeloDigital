import { inject, Injectable } from '@angular/core';
import { catalogoPaneles } from '../../dominio/entidades/catalogoPaneles.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioPaneles } from '../puertos/repositorioPaneles';

/**
 * Caso de uso: listar el catálogo de paneles solares con filtros opcionales.
 */
@Injectable({ providedIn: 'root' })
export class listarPanelesSolares
{
    private readonly repositorio = inject(repositorioPaneles);

    async ejecutar(
        fabricante: string | null = null,
        potenciaMinimaWatts: number | null = null,
    ): Promise<catalogoPaneles>
    {
        const fabricanteValidado = validadorEntrada.textoOpcional(
            fabricante,
            'El fabricante',
            80,
        );
        const potenciaValidada = validadorEntrada.numeroOpcional(
            potenciaMinimaWatts,
            'La potencia mínima',
            { minimo: 0, minimoExclusivo: true, maximo: 100000 },
        );

        return this.repositorio.listar(fabricanteValidado, potenciaValidada);
    }
}
