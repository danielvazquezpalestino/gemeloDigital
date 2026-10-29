import { beneficioIncentivo } from '../../dominio/entidades/beneficioIncentivo.entidad';
import { consultaIncentivos } from '../../dominio/entidades/consultaIncentivos.entidad';
import { evaluacionElegibilidadIncentivos } from '../../dominio/entidades/evaluacionElegibilidadIncentivos.entidad';
import { evaluacionIncentivo } from '../../dominio/entidades/evaluacionIncentivo.entidad';
import { incentivo } from '../../dominio/entidades/incentivo.entidad';
import { requisitoIncentivo } from '../../dominio/entidades/requisitoIncentivo.entidad';
import { estadoEvaluacionIncentivo } from '../../dominio/objetosValor/estadoEvaluacionIncentivo';
import { tipoBeneficiario } from '../../dominio/objetosValor/tipoBeneficiario';
import { respuestaElegibilidadDto } from '../dto/respuestaElegibilidad.dto';
import {
    beneficioIncentivoDto,
    incentivoDto,
    requisitoIncentivoDto,
    respuestaIncentivosDto,
} from '../dto/respuestaIncentivos.dto';
import { fechaMapeador } from './fecha.mapeador';

/**
 * Traduce los DTO de incentivos a entidades de dominio.
 */
export class incentivosMapeador
{
    static aDominioConsulta(dto: respuestaIncentivosDto): consultaIncentivos
    {
        return new consultaIncentivos(
            dto.total,
            dto.pagina,
            dto.limite,
            dto.incentivos.map((incentivoDto) => this.aDominioIncentivo(incentivoDto)),
        );
    }

    static aDominioElegibilidad(dto: respuestaElegibilidadDto): evaluacionElegibilidadIncentivos
    {
        return new evaluacionElegibilidadIncentivos(
            dto.datos.beneficiaryType as tipoBeneficiario,
            dto.datos.municipality,
            dto.datos.systemCapacityKw,
            dto.datos.installationType,
            fechaMapeador.aFecha(dto.fechaEvaluacion),
            dto.evaluaciones.map(
                (evaluacion) => new evaluacionIncentivo(
                    this.aDominioIncentivo(evaluacion.incentivo),
                    evaluacion.estado as estadoEvaluacionIncentivo,
                    evaluacion.requisitosCumplidos.map(
                        (requisito) => this.aDominioRequisito(requisito),
                    ),
                    evaluacion.requisitosPendientes.map(
                        (requisito) => this.aDominioRequisito(requisito),
                    ),
                    evaluacion.datosFaltantes,
                    evaluacion.explicacion,
                ),
            ),
        );
    }

    private static aDominioIncentivo(dto: incentivoDto): incentivo
    {
        return new incentivo(
            dto.id,
            dto.programa,
            dto.nombre,
            dto.descripcion,
            dto.beneficiarios,
            dto.municipioId,
            dto.requisitos.map((requisito) => this.aDominioRequisito(requisito)),
            dto.beneficios.map((beneficio) => this.aDominioBeneficio(beneficio)),
            fechaMapeador.aFechaOpcional(dto.vigenciaDesde),
            fechaMapeador.aFechaOpcional(dto.vigenciaHasta),
            dto.organismoResponsable,
            dto.fuenteOficial,
            dto.verificado,
        );
    }

    private static aDominioRequisito(dto: requisitoIncentivoDto): requisitoIncentivo
    {
        return new requisitoIncentivo(
            dto.campo,
            dto.descripcion,
            dto.verificado,
            dto.requerido,
            dto.valor,
        );
    }

    private static aDominioBeneficio(dto: beneficioIncentivoDto): beneficioIncentivo
    {
        return new beneficioIncentivo(dto.tipo, dto.monto, dto.porcentaje, dto.moneda);
    }
}
