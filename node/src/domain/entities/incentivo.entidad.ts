import RequisitoIncentivo = require('./requisito-incentivo.entidad');

class Incentivo
{
    constructor(
        public readonly id: string,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly tipo: string,
        public readonly montoMaximoMxn: number | null,
        public readonly requisitos: readonly RequisitoIncentivo[],
        public readonly esDemostracion: boolean,
    )
    {
    }
}

export = Incentivo;
