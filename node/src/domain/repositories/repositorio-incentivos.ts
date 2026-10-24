import DtoConsultarIncentivos = require('../entities/dtos/incentivos/consultar-incentivos.dto');
import DtoEvaluarElegibilidad = require('../entities/dtos/incentivos/evaluar-elegibilidad.dto');
import EvaluacionIncentivo = require('../entities/evaluacion-incentivo.entidad');
import HistorialIncentivos = require('../entities/historial-incentivos.entidad');

/**
 * Puerto (contrato) del módulo de incentivos: casos de uso de negocio.
 * La implementación concreta vive en `infrastructure/repositories`.
 */
abstract class RepositorioIncentivos
{
    abstract listar(filtros: DtoConsultarIncentivos): Promise<HistorialIncentivos>;

    abstract evaluarElegibilidad(dto: DtoEvaluarElegibilidad): Promise<EvaluacionIncentivo[]>;
}

export = RepositorioIncentivos;
