import Incentivo = require('../entities/incentivo.entidad');

abstract class FuenteDatosIncentivos
{
    abstract listar(): Promise<Incentivo[]>;

    abstract buscarPorId(id: string): Promise<Incentivo | null>;
}

export = FuenteDatosIncentivos;
