import DtoConsultarIncentivos = require('../entities/dtos/incentivos/consultar-incentivos.dto');
import Incentivo = require('../entities/incentivo.entidad');

/**
 * Puerto (contrato) de persistencia del módulo de incentivos.
 * La implementación concreta vive en `infrastructure/datasources`.
 */
abstract class FuenteDatosIncentivos
{
    abstract listar(municipioId: number | null): Promise<Incentivo[]>;

    abstract contar(municipioId: number | null): Promise<number>;
}

export = FuenteDatosIncentivos;
