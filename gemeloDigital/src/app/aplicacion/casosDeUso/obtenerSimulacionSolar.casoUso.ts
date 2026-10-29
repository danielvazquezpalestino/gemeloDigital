import { inject, Injectable } from '@angular/core';
import { simulacionSolar } from '../../dominio/entidades/simulacionSolar.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { repositorioSimulaciones } from '../puertos/repositorioSimulaciones';

/**
 * Caso de uso: obtener una simulación solar por su identificador.
 */
@Injectable({ providedIn: 'root' })
export class obtenerSimulacionSolar
{
    private readonly repositorio = inject(repositorioSimulaciones);

    async ejecutar(id: number): Promise<simulacionSolar>
    {
        const idValidado = validadorEntrada.enteroObligatorio(id, 'El identificador', {
            minimo: 0,
            minimoExclusivo: true,
        });

        return this.repositorio.obtener(idValidado);
    }
}
