import { consultaIncentivos } from '../../dominio/entidades/consultaIncentivos.entidad';
import { evaluacionElegibilidadIncentivos } from '../../dominio/entidades/evaluacionElegibilidadIncentivos.entidad';
import { estadoIncentivo } from '../../dominio/objetosValor/estadoIncentivo';
import { tipoBeneficiario } from '../../dominio/objetosValor/tipoBeneficiario';

/**
 * Filtros opcionales para consultar el catálogo de incentivos.
 */
export interface filtrosIncentivos
{
    readonly tipoBeneficiario?: tipoBeneficiario | null;
    readonly municipio?: string | null;
    readonly estado?: estadoIncentivo | null;
    readonly pagina?: number;
    readonly limite?: number;
}

/**
 * Datos necesarios para evaluar la elegibilidad de un solicitante.
 */
export interface solicitudElegibilidadIncentivos
{
    readonly tipoBeneficiario: tipoBeneficiario;
    readonly municipio: string;
    readonly capacidadSistemaKw?: number | null;
    readonly tipoInstalacion?: string | null;
}

/**
 * Puerto de acceso al catálogo y a la evaluación de incentivos.
 */
export abstract class repositorioIncentivos
{
    abstract consultar(filtros: filtrosIncentivos): Promise<consultaIncentivos>;

    abstract evaluarElegibilidad(
        solicitud: solicitudElegibilidadIncentivos,
    ): Promise<evaluacionElegibilidadIncentivos>;
}
