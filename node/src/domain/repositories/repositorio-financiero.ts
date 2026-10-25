import DtoEstimarFinanciero = require('../entities/dtos/financiero/estimar-financiero.dto');
import ResultadoFinanciero = require('../entities/resultado-financiero.entidad');

abstract class RepositorioFinanciero
{
    abstract calcularEstimacion(dto: DtoEstimarFinanciero): ResultadoFinanciero;
}

export = RepositorioFinanciero;
