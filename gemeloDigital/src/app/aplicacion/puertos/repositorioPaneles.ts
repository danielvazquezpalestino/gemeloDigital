import { catalogoPaneles } from '../../dominio/entidades/catalogoPaneles.entidad';

/**
 * Puerto de acceso al catálogo de paneles solares.
 */
export abstract class repositorioPaneles
{
    abstract listar(
        fabricante: string | null,
        potenciaMinimaWatts: number | null,
    ): Promise<catalogoPaneles>;
}
