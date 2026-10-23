import DtoEstimacionFinanciera = require('../../domain/entities/dtos/financiero/estimacion-financiera.dto');
import EstimacionFinanciera = require('../../domain/entities/estimacion-financiera.entidad');
import RepositorioFinanciero = require('../../domain/repositories/repositorio-financiero');
import CalculadoraFinanciera = require('../../domain/servicios/calculadora-financiera');

class RepositorioFinancieroImpl extends RepositorioFinanciero
{
    constructor(private readonly calculadoraFinanciera: CalculadoraFinanciera)
    {
        super();
    }

    calcularEstimacion(dto: DtoEstimacionFinanciera): EstimacionFinanciera
    {
        return this.calculadoraFinanciera.calcular(dto);
    }
}

export = RepositorioFinancieroImpl;
