import DtoEstimacionFinanciera = require('../entities/dtos/financiero/estimacion-financiera.dto');
import EstimacionFinanciera = require('../entities/estimacion-financiera.entidad');

abstract class RepositorioFinanciero
{
    abstract calcularEstimacion(dto: DtoEstimacionFinanciera): EstimacionFinanciera;
}

export = RepositorioFinanciero;
