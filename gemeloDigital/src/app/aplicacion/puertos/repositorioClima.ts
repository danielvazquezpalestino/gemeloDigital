import { pronostico } from '../../dominio/entidades/pronostico.entidad';

/**
 * Puerto de acceso al pronóstico meteorológico.
 */
export abstract class repositorioClima
{
    abstract obtenerPronostico(latitud: number, longitud: number, dias: number): Promise<pronostico>;
}
