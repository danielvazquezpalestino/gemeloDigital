import DtoEstimarFinanciero = require('../../domain/entities/dtos/financiero/estimar-financiero.dto');
import ResultadoFinanciero = require('../../domain/entities/resultado-financiero.entidad');
import RepositorioFinanciero = require('../../domain/repositories/repositorio-financiero');
import CalculadoraFinanciera = require('../../domain/servicios/calculadora-financiera');

class RepositorioFinancieroImpl extends RepositorioFinanciero
{
    constructor(private readonly calculadoraFinanciera: CalculadoraFinanciera)
    {
        super();
    }

    calcularEstimacion(dto: DtoEstimarFinanciero): ResultadoFinanciero
    {
        return this.calculadoraFinanciera.calcular(dto);
    }
}

export = RepositorioFinancieroImpl;
