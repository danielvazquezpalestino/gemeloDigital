import CustomError = require('../../domain/datasources/errors/custom.error');
import FuenteDatosIncentivos = require('../../domain/datasources/fuente-datos-incentivos');
import Incentivo = require('../../domain/entities/incentivo.entidad');
import RepositorioIncentivos = require('../../domain/repositories/repositorio-incentivos');

class RepositorioIncentivosImpl implements RepositorioIncentivos
{
    constructor(private readonly fuenteDatos: FuenteDatosIncentivos)
    {
    }

    listar(): Promise<Incentivo[]>
    {
        return this.fuenteDatos.listar();
    }

    async obtenerPorId(id: string): Promise<Incentivo>
    {
        const incentivo = await this.fuenteDatos.buscarPorId(id);

        if (!incentivo)
        {
            throw CustomError.notFound(`El incentivo "${id}" no existe en el catálogo configurado`);
        }

        return incentivo;
    }
}

export = RepositorioIncentivosImpl;
