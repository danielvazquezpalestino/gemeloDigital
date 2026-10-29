import { bloqueConsumoTarifa } from './bloqueConsumoTarifa.entidad';

/**
 * Tarifa eléctrica del catálogo de la CFE.
 */
export class tarifaElectrica
{
    constructor
    (
        public readonly codigo: string,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly tipoUsuario: string,
        public readonly bloques: readonly bloqueConsumoTarifa[],
        public readonly esDemostracion: boolean,
    )
    {
    }
}
