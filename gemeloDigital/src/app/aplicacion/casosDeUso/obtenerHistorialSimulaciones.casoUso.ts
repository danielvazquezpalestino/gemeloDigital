import { inject, Injectable } from '@angular/core';
import { consultaSimulaciones } from '../../dominio/entidades/consultaSimulaciones.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { filtrosSimulaciones, repositorioSimulaciones } from '../puertos/repositorioSimulaciones';

/**
 * Caso de uso: obtener el historial paginado de simulaciones solares.
 */
@Injectable({ providedIn: 'root' })
export class obtenerHistorialSimulaciones
{
    private readonly repositorio = inject(repositorioSimulaciones);

    async ejecutar(filtros: filtrosSimulaciones = {}): Promise<consultaSimulaciones>
    {
        const filtrosNormalizados: filtrosSimulaciones = {
            municipioId: validadorEntrada.enteroOpcional(
                filtros.municipioId,
                'El municipio',
                { minimo: 1, maximo: 100000 },
            ),
            pagina: validadorEntrada.enteroOpcional(filtros.pagina, 'La página', {
                minimo: 1,
                maximo: 100000,
            }) ?? 1,
            limite: validadorEntrada.enteroOpcional(filtros.limite, 'El límite', {
                minimo: 1,
                maximo: 100,
            }) ?? 20,
        };

        return this.repositorio.listar(filtrosNormalizados);
    }
}
