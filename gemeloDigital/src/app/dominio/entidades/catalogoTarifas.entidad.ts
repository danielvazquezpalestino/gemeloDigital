import { tarifaElectrica } from './tarifaElectrica.entidad';

/**
 * Catálogo de tarifas eléctricas y su advertencia de demostración.
 */
export class catalogoTarifas
{
    constructor
    (
        public readonly esDemostracion: boolean,
        public readonly advertencia: string | null,
        public readonly tarifas: readonly tarifaElectrica[],
    )
    {
    }
}
