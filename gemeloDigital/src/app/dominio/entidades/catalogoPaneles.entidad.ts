import { panelSolar } from './panelSolar.entidad';

/**
 * Catálogo de paneles solares y su advertencia de demostración.
 */
export class catalogoPaneles
{
    constructor
    (
        public readonly esDemostracion: boolean,
        public readonly advertencia: string,
        public readonly paneles: readonly panelSolar[],
    )
    {
    }
}
