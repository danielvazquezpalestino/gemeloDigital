import { produccionSolar } from '../../dominio/entidades/produccionSolar.entidad';
import { radiacionSolar } from '../../dominio/entidades/radiacionSolar.entidad';

/**
 * Ubicación opcional para consultar la radiación solar.
 */
export interface solicitudRadiacionSolar
{
    readonly latitud: number | null;
    readonly longitud: number | null;
    readonly municipioId: number | null;
}

/**
 * Datos para calcular la producción solar estimada.
 */
export interface solicitudProduccionSolar
{
    readonly capacidadKwp: number;
    readonly eficiencia: number;
    readonly latitud: number | null;
    readonly longitud: number | null;
    readonly municipioId: number | null;
}

/**
 * Puerto de acceso a la radiación y producción solar.
 */
export abstract class repositorioSolar
{
    abstract obtenerRadiacion(solicitud: solicitudRadiacionSolar): Promise<radiacionSolar>;

    abstract calcularProduccion(solicitud: solicitudProduccionSolar): Promise<produccionSolar>;
}
