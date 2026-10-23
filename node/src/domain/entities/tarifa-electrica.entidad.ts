import BloqueConsumoTarifa = require('./bloque-consumo-tarifa.entidad');

class TarifaElectrica
{
    constructor(
        public readonly codigo: string,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly tipoUsuario: string,
        public readonly bloques: readonly BloqueConsumoTarifa[],
        public readonly esDemostracion: boolean,
    )
    {
    }
}

export = TarifaElectrica;
