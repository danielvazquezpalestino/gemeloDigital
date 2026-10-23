import Incentivo = require('../entities/incentivo.entidad');

abstract class RepositorioIncentivos
{
    abstract listar(): Promise<Incentivo[]>;

    abstract obtenerPorId(id: string): Promise<Incentivo>;
}

export = RepositorioIncentivos;
