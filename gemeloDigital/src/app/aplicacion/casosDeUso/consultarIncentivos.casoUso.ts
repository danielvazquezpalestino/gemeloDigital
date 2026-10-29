import { inject, Injectable } from '@angular/core';
import { consultaIncentivos } from '../../dominio/entidades/consultaIncentivos.entidad';
import { validadorEntrada } from '../../dominio/validacion/validadorEntrada';
import { filtrosIncentivos, repositorioIncentivos } from '../puertos/repositorioIncentivos';

/**
 * Caso de uso: consultar el catálogo paginado de incentivos.
 */
@Injectable({ providedIn: 'root' })
export class consultarIncentivos
{
    private readonly repositorio = inject(repositorioIncentivos);

    async ejecutar(filtros: filtrosIncentivos = {}): Promise<consultaIncentivos>
    {
        const filtrosNormalizados: filtrosIncentivos = {
            tipoBeneficiario: validadorEntrada.tipoBeneficiarioOpcional(filtros.tipoBeneficiario),
            municipio: validadorEntrada.textoOpcional(filtros.municipio, 'El municipio', 120),
            estado: validadorEntrada.estadoIncentivoOpcional(filtros.estado),
            pagina: validadorEntrada.enteroOpcional(filtros.pagina, 'La página', {
                minimo: 1,
                maximo: 10000,
            }) ?? 1,
            limite: validadorEntrada.enteroOpcional(filtros.limite, 'El límite', {
                minimo: 1,
                maximo: 100,
            }) ?? 20,
        };

        return this.repositorio.consultar(filtrosNormalizados);
    }
}
