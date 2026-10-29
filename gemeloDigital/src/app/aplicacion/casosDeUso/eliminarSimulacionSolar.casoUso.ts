import { inject, Injectable } from '@angular/core';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioSimulaciones } from '../puertos/repositorioSimulaciones';

/**
 * Caso de uso: eliminar una simulación solar registrada.
 */
@Injectable({ providedIn: 'root' })
export class eliminarSimulacionSolar
{
    private readonly repositorio = inject(repositorioSimulaciones);

    async ejecutar(id: number): Promise<void>
    {
        const idValidado = validadorEntrada.enteroObligatorio(id, 'El identificador', {
            minimo: 0,
            minimoExclusivo: true,
        });

        await this.repositorio.eliminar(idValidado);
    }
}
